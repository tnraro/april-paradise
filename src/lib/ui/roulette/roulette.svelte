<script lang="ts">
  import type { Item, Money } from "$lib/data/sheets/model";

  interface Props {
    table: { key: string; item: Money | Item }[];
    onroll?: () => void;
    onreward?: () => void;
    result: string | undefined;
  }
  let { onroll, table, result, onreward } = $props<Props>();
  let t: number;

  const setSlots = (index: number) => {
    slots = [
      table[index % table.length],
      table[(index + 1) % table.length],
      table[(index + 2) % table.length],
      table[(index + 3) % table.length],
    ];
  };
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
    ay = 0;
    index = table.findIndex((x) => x.key === result) + table.length - 1;
    setSlots(index);
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
    ay = 4;
    onroll?.();
    let i = 0;
    bulbs = bulbs.map(() => false);
    t = setInterval(() => {
      bulbs = bulbs.map((bulb, j) => i === j && !bulb);
      i = (i + 1) % bulbs.length;
    }, 100) as unknown as number;
  };
  const bulbPoses = [
    { x: 20, y: 70 },
    { x: 20, y: 50 },
    { x: 15, y: 28 },
    { x: 30, y: 15 },
    { x: 50, y: 8 },
    { x: 120 - 50, y: 8 },
    { x: 120 - 30, y: 15 },
    { x: 120 - 15, y: 28 },
    { x: 120 - 20, y: 50 },
    { x: 120 - 20, y: 70 },
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
  const enum RouletteState {
    Idle,
    InsertingToken,
    Rolling,
    DroppingReward,
  }
  let _state = $state<RouletteState>(RouletteState.Idle);
  let slots = $state.frozen<{ key: string; item: Money | Item }[]>(
    table.slice(0, 4),
  );
  let reward = $derived(
    result == null ? undefined : table.find((x) => x.key === result)?.item,
  );
  let ay = $state(0);
  let index = 0;
</script>

<svg viewBox="0 0 120 140">
  <defs>
    <linearGradient id="title_shadow" gradientTransform="rotate(90)">
      <stop offset="0%" stop-color="var(--slate-a6)"></stop>
      <stop offset="100%" stop-color="transparent"></stop>
    </linearGradient>
    <filter id="slot_blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0,{ay}" />
    </filter>
    <linearGradient id="slot_shadow" gradientTransform="rotate(90)">
      <stop offset="0%" stop-color="var(--slate-a6)"></stop>
      <stop offset="20%" stop-color="transparent"></stop>
      <stop offset="80%" stop-color="transparent"></stop>
      <stop offset="100%" stop-color="var(--slate-a6)"></stop>
    </linearGradient>
    <filter id="bulb_blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
    </filter>
    <path
      id="title_curve"
      d="M 25 38
          C 40 19, 80 19, 95 38"
    />
    <circle id="bulb" r="1.4"></circle>
    <radialGradient id="token_bg" cy="75%" r="100%">
      <stop offset="0%" stop-color="var(--sand-4)"></stop>
      <stop offset="100%" stop-color="var(--sand-6)"></stop>
    </radialGradient>
  </defs>
  <g
    class="roulette"
    class:roulette--rolling={_state === RouletteState.Rolling}
  >
    <!-- slot -->
    <rect x="30" y="43" width="60" height="30" fill="var(--sand-12)" />
    <rect
      x="12"
      y="43"
      width="18"
      height="32"
      stroke="var(--sand-6)"
      fill="var(--red-9)"
    />
    <rect
      x="90"
      y="43"
      width="18"
      height="32"
      stroke="var(--sand-6)"
      fill="var(--red-9)"
    />
    <g
      class="slot"
      filter="url(#slot_blur)"
      style="animation-duration:{(16 / ay) * 0.01}s"
      onanimationiteration={() => {
        index++;
        setSlots(index);
      }}
    >
      {#each slots as slot, i}
        <g transform="translate(32, {36 + i * 16})">
          <rect class="slot_bg" width="56" height="15"></rect>
          {#if slot.item.type === "tokens"}
            <image width="14" height="14" href="/icons/token.png"></image>
            <text class="slot_text" x="14" y={1 + 15 * 0.5}>
              토큰 {slot.item.quantity}
            </text>
          {:else if slot.item.type === "chips"}
            <image width="14" height="14" href="/icons/chip.png"></image>
            <text class="slot_text" x="14" y={1 + 15 * 0.5}>
              칩 {slot.item.quantity}
            </text>
          {:else if slot.item.type === "item"}
            <text
              class="slot_text"
              x="28"
              y={1 + 15 * 0.5}
              text-anchor="middle"
            >
              {slot.item.id}
            </text>
          {/if}
        </g>
      {/each}
    </g>
    <path
      class="arrow"
      fill="var(--blue-9)"
      stroke="var(--sand-6)"
      transform="translate(21, 59.5)"
    />
    <path
      class="arrow"
      fill="var(--amber-9)"
      stroke="var(--sand-6)"
      transform="translate(100, 59.5) scale(-1, 1)"
    />
    <rect x="30" y="44" width="60" height="29" fill="url(#slot_shadow)" />
    <rect x="12" y="44" width="96" height="10" fill="url(#title_shadow)" />
    <!-- title -->
    <g stroke="var(--sand-6)" fill="var(--red-9)">
      <rect x="10" y="29" width="100" height="15" rx="2" />
      <path
        id="title_curve"
        d="M 10 30
            C 25 -5, 95 -5, 110 30"
      />
    </g>
    <text class="title">
      <textPath xlink:href="#title_curve">카락실 환전기</textPath>
    </text>
    <text class="royal" x="50%" y="35">로얄</text>
    <!-- bulbs -->
    {#each bulbs as on, i}
      {@const pos = bulbPoses[i]}
      <use
        href="#bulb"
        x={pos.x}
        y={pos.y}
        fill="var(--yellow-{on ? 9 : 11})"
        filter={on ? "url(#bulb_blur)" : ""}
      />
    {/each}
    <!-- body -->
    <rect
      x="10"
      y="73"
      width="100"
      height="65"
      stroke="var(--sand-6)"
      fill="var(--sand-3)"
      rx="2"
    />
    <g transform="translate(30, 80)">
      <ellipse rx="10" ry="5" fill="url(#token_bg)" />
      <rect
        x="-8"
        y="-1"
        width="16"
        height="2"
        fill="var(--sand-12)"
        stroke="var(--sand-4)"
        paint-order="stroke"
      />
    </g>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <g class="button" tabindex="0" {onclick}>
      <rect class="button_bg" x="20" y="90" width="80" height="30" rx="4" />
      <text class="button_text" x="50%" y="105">
        {#if _state === RouletteState.Idle}
          토큰을 넣으세요
        {:else if _state === RouletteState.InsertingToken}
          토큰을 넣으세요
        {:else if _state === RouletteState.Rolling}
          멈추기
        {:else if _state === RouletteState.DroppingReward}
          보상 받기
        {/if}
      </text>
    </g>

    {#if _state === RouletteState.InsertingToken}
      <g transform="translate(30, 80)">
        <mask id="inserting-token_mask">
          <rect x="-8" y="-1" width="16" height="20" fill="white"></rect>
        </mask>
        <g mask="url(#inserting-token_mask)">
          <image
            class="inserting-token"
            x="-8"
            y="-18"
            width="16"
            height="16"
            href="/icons/token.png"
            onanimationend={roll}
          ></image>
        </g>
      </g>
    {/if}

    <g transform="translate(60, 122)">
      <rect
        x="-16"
        width="32"
        height="15"
        fill="var(--slate-12)"
        rx="2"
        stroke="var(--slate-6)"
      />
      <mask id="reward_mask">
        <rect x="-15" y="1" width="30" height="13" rx="1" fill="white" />
      </mask>
      {#if _state === RouletteState.DroppingReward && reward != null}
        <g mask="url(#reward_mask)">
          {#if reward.type === "item"}
            {#if reward.id !== "꽝"}
              <text
                class="reward-item"
                font-size="4"
                fill="white"
                y={-10}
                text-anchor="middle"
                dominant-baseline="middle">{reward.id}</text
              >
            {/if}
          {:else}
            {#each { length: reward.quantity } as _, i}
              <image
                class="reward-item"
                style="animation-delay:{i * 50}ms"
                x={Math.random() * 24 - 6 - 12}
                y={-12 - 4}
                width="12"
                height="12"
                href="/icons/{reward.type === 'chips' ? 'chip' : 'token'}.png"
              ></image>
            {/each}
          {/if}
        </g>
      {/if}
    </g>
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
  .title {
    font-family: var(--font-serif);
    font-size: 13.1px;
    font-weight: 900;
    paint-order: stroke;
    stroke: var(--yellow-10);
    stroke-width: 2px;
    filter: drop-shadow(1px 1px 0 var(--red-12));
  }
  .royal {
    font-family: var(--font-serif);
    font-size: 9px;
    font-weight: 700;
    fill: var(--yellow-10);
    text-anchor: middle;
    dominant-baseline: middle;
    filter: drop-shadow(1px 1px 0 var(--red-12));
  }
  .slot {
    animation: roll 0s linear infinite;
    &_bg {
      fill: white;
    }
    &_text {
      fill: var(--sand-11);
      dominant-baseline: middle;
      font-weight: 700;
      font-size: 9px;
    }
  }
  .button {
    outline: none;
    fill: var(--red-9);
    cursor: pointer;

    &:hover {
      fill: var(--red-10);
    }
    &_text {
      font-family: var(--font-serif);
      text-anchor: middle;
      dominant-baseline: middle;
      fill: var(--sand-12);
      font-weight: 700;
      font-size: 9px;
      paint-order: stroke;
      stroke: var(--yellow-10);
      stroke-width: 2px;
      filter: drop-shadow(1px 1px 0 var(--red-12));
    }
  }
  .arrow {
    stroke: var(--sand-6);
    stroke-width: 1px;
    filter: drop-shadow(0 1px 0 var(--red-12));
    d: path("m0-3V-6L6 0L0 6V3H-6V-3z");
  }
  .inserting-token {
    animation: inserting-token 1s forwards;
  }
  .reward-item {
    transform: translateY(0);
    animation: reward-item 5s ease-in;
  }
  @keyframes -global-reward-item {
    0% {
      transform: translateY(0);
    }
    2% {
      transform: translateY(20px);
    }
    100% {
      opacity: 0;
      transform: translateY(20px);
    }
  }
  @keyframes -global-inserting-token {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    25% {
      opacity: 100;
      transform: translateY(15px);
    }
    50% {
      transform: translateY(15px);
    }
    100% {
      transform: translateY(0px);
    }
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

  @keyframes -global-roll {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-16px);
    }
  }
</style>
