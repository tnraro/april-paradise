<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import type { Item, Money, RouletteData } from "$lib/data/sheets/model";
  import { sleep } from "$lib/shared/util/sleep";
  import { useWallet } from "$routes/(main)/wallet.svelte";
  import { RouletteState } from "./roulette";
  import Arrow from "./roulette-arrow.svelte";
  import Body from "./roulette-body.svelte";
  import BulbFilter from "./roulette-bulb-filter.svelte";
  import Bulb from "./roulette-bulb.svelte";
  import Button from "./roulette-button.svelte";
  import InsertingToken from "./roulette-inserting-token.svelte";
  import Lcd from "./roulette-lcd.svelte";
  import Sign from "./roulette-sign.svelte";
  import Slots from "./roulette-slots.svelte";
  import Vent from "./roulette-vent.svelte";

  interface Props {
    table: { key: string; result: Money | Item }[];
    onroll?: () => Promise<{ result: RouletteData }>;
    onreward?: () => void;
  }
  let { onroll, table, onreward }: Props = $props();
  let t: number;

  const wallet = useWallet();

  const onclick = () => {
    switch (_state) {
      case RouletteState.Idle:
        if (wallet.tokens > 0) {
          _state = RouletteState.InsertingToken;
          wallet.tokens--;
        } else {
          _state = RouletteState.NotEnoughTokens;
        }
        result = undefined;
        Promise.all([onroll?.(), sleep(2000)])
          .then(([res]) => {
            result = res?.result;
            _state = RouletteState.Rolling;
          })
          .catch((error) => {
            console.error(error);
            clearInterval(t);
            _state = RouletteState.NotEnoughTokens;
            speed = 0;
          });
        break;
      case RouletteState.InsertingToken:
      case RouletteState.Pending:
        break;
      case RouletteState.Rolling:
        done();
        break;
      case RouletteState.DroppingReward:
      case RouletteState.Reward:
        clearInterval(t);
        onreward?.();
        _state = RouletteState.Idle;
        break;
      case RouletteState.NotEnoughTokens:
        _state = RouletteState.Idle;
    }
  };
  const done = () => {
    if (result == null) return;
    clearInterval(t);
    speed = 0;
    index = table.findIndex((x) => x.key === result?.key) + table.length - 1;
    bulbs = bulbs.map(() => false);
    if (result.key.startsWith("losing")) {
      onreward?.();
      _state = RouletteState.Idle;
    } else {
      t = setInterval(() => {
        bulbs = bulbs.map((bulb) => !bulb);
      }, 100) as unknown as number;
      invalidateAll();
      _state = RouletteState.DroppingReward;
    }
  };
  const roll = () => {
    _state = RouletteState.Pending;
    speed = 4;
    let i = 0;
    bulbs = bulbs.map(() => false);
    t = setInterval(() => {
      bulbs = bulbs.map((bulb, j) => i === j && !bulb);
      i = (i + 1) % bulbs.length;
    }, 100) as unknown as number;
  };
  const bulbPoses = [
    { x: -40, y: 70 },
    { x: -40, y: 50 },
    { x: -45, y: 28 },
    { x: -30, y: 15 },
    { x: -10, y: 8 },
    { x: 10, y: 8 },
    { x: 30, y: 15 },
    { x: 45, y: 28 },
    { x: 40, y: 50 },
    { x: 40, y: 70 },
  ];
  let bulbs = $state.frozen([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  let _state = $state<RouletteState>(RouletteState.Idle);
  let index = $state(0);
  let speed = $state(0);
  let result = $state<RouletteData>();
  let reward = $derived(result == null ? undefined : result.result);
  let lcdText = $derived.by(() => {
    switch (_state) {
      case RouletteState.Idle:
      case RouletteState.InsertingToken:
        return "토큰을 넣어주세요";
      case RouletteState.Pending:
        return "";
      case RouletteState.Rolling:
        return "버튼을 눌러 멈추세요";
      case RouletteState.DroppingReward:
      case RouletteState.Reward:
        return "보상을 받으세요";
      case RouletteState.NotEnoughTokens:
        return "토큰이 없습니다";
    }
  });
</script>

<svg viewBox="-60 0 120 140">
  <defs>
    <BulbFilter />
  </defs>
  <g
    class="roulette"
    class:roulette--quaking={_state === RouletteState.Rolling ||
      _state === RouletteState.DroppingReward}
  >
    <!-- slot -->
    <Slots {table} {speed} bind:index />
    <Arrow x={-39} y={60} r={0} />
    <Arrow x={39} y={60} r={180} color="var(--amber-9)" />
    <!-- title -->
    <Sign />
    <!-- bulbs -->
    {#each bulbs as on, i}
      {@const pos = bulbPoses[i]}
      <Bulb x={pos.x} y={pos.y} {on} />
    {/each}
    <!-- body -->
    <Body />

    <Vent
      {_state}
      {reward}
      onanimationend={() => (_state = RouletteState.Reward)}
    />

    <Lcd text={lcdText} />
    <text class="gaze" x="24" y="85">여길 눌러! -&gt;</text>
    <Button
      {onclick}
      x={32}
      y={84}
      width={10}
      height={10}
      pressed={_state === RouletteState.InsertingToken ||
        _state === RouletteState.Pending}
    />

    {#if _state === RouletteState.InsertingToken}
      <InsertingToken onanimationend={roll} />
    {/if}
  </g>
</svg>

<style lang="scss">
  .roulette {
    user-select: none;
    -webkit-user-select: none;
  }
  .roulette--quaking {
    animation: slot_quake 0.1s infinite;
  }
  .gaze {
    text-anchor: end;
    dominant-baseline: middle;
    font-weight: 900;
    font-size: 7px;
    fill: var(--sand-7);
  }
  @keyframes -global-slot_quake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(0.2px);
    }
    75% {
      transform: translateX(-0.2px);
    }
    100% {
      transform: translateX(0);
    }
  }
</style>
