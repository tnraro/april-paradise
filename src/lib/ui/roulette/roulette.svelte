<script lang="ts">
  import type { Item, Money } from "$lib/data/sheets/model";
  import { RouletteState } from "./roulette";
  import Arrow from "./roulette-arrow.svelte";
  import Body from "./roulette-body.svelte";
  import BulbFilter from "./roulette-bulb-filter.svelte";
  import Bulb from "./roulette-bulb.svelte";
  import Button from "./roulette-button.svelte";
  import RouletteInsertingToken from "./roulette-inserting-token.svelte";
  import Sign from "./roulette-sign.svelte";
  import Slots from "./roulette-slots.svelte";
  import RouletteVent from "./roulette-vent.svelte";

  interface Props {
    table: { key: string; item: Money | Item }[];
    onroll?: () => void;
    onreward?: () => void;
    result: string | undefined;
  }
  let { onroll, table, result, onreward } = $props<Props>();
  let t: number;

  const onclick = () => {
    if (_state === RouletteState.Idle) {
      _state = RouletteState.InsertingToken;
    } else if (_state === RouletteState.InsertingToken) {
    } else if (_state === RouletteState.Rolling) {
      done();
    } else if (_state === RouletteState.DroppingReward) {
      clearInterval(t);
      onreward?.();
      _state = RouletteState.Idle;
    }
  };
  const done = () => {
    if (result == null) return;
    clearInterval(t);
    speed = 0;
    index = table.findIndex((x) => x.key === result) + table.length - 1;
    bulbs = bulbs.map(() => false);
    if (result.startsWith("losing")) {
      _state = RouletteState.Idle;
    } else {
      _state = RouletteState.DroppingReward;
      t = setInterval(() => {
        bulbs = bulbs.map((bulb) => !bulb);
      }, 100) as unknown as number;
    }
  };
  const roll = () => {
    result = undefined;
    _state = RouletteState.Rolling;
    speed = 4;
    onroll?.();
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
  let reward = $derived(
    result == null ? undefined : table.find((x) => x.key === result)?.item,
  );
</script>

<svg viewBox="-60 0 120 140">
  <defs>
    <BulbFilter />
  </defs>
  <g
    class="roulette"
    class:roulette--rolling={_state === RouletteState.Rolling}
  >
    <!-- slot -->
    <Slots {table} {speed} bind:index={index} />
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

    <RouletteVent {_state} {reward} />

    <Button {onclick} {_state} />
    
    {#if _state === RouletteState.InsertingToken}
      <RouletteInsertingToken onanimationend={roll} />
    {/if}
  </g>
</svg>

<style lang="scss">
  .roulette {
    user-select: none;
    -webkit-user-select: none;
  }
  .roulette--rolling {
    animation: slot_quake 0.1s infinite;
  }
  .result {
    height: 1.5rem;
    border: 1px solid var(--sand-6);
    border-radius: 0.25rem;
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
