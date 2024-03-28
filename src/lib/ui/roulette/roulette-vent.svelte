<script lang="ts">
  import type { Item, Money } from "$lib/data/sheets/model";
  import { untrack } from "svelte";
  import { RouletteState } from "./roulette";
  import { chipSrc, tokenSrc } from "./roulette-resources";

  interface Props {
    _state: RouletteState;
    reward: Item | Money | undefined;
    onanimationend?: () => void;
  }
  let { _state, reward, onanimationend }: Props = $props();
  const dropDelay = 50;
  let t: number;
  $effect(() => {
    clearTimeout(t);
    if (_state === RouletteState.DroppingReward) {
      const r = untrack(() => reward);
      if (r == null) return;
      const count = r.type === "item" ? 1 : r.quantity;
      const delay = count * dropDelay;
      if (onanimationend)
        t = setTimeout(onanimationend, delay) as unknown as number;
    }
  });
</script>

<defs>
  <linearGradient id="roulette-vent_inset" gradientTransform="rotate(45)">
    <stop offset="50%" stop-color="var(--sand-7)"></stop>
    <stop offset="90%" stop-color="var(--sand-4)"></stop>
  </linearGradient>
  <clipPath id="roulette-vent_mask">
    <rect x="-15.5" y="120.5" width="31" height="16" rx="1" />
  </clipPath>

  <path d="M0 112L0 137Q0 130,0 137L0 137" />
</defs>

<rect class="roulette-vent" x="-16" y="120" width="32" height="17" rx="2" />

{#if (_state === RouletteState.DroppingReward || _state === RouletteState.Reward) && reward != null}
  <g clip-path="url(#roulette-vent_mask)">
    {#if reward.type === "item"}
      {#if reward.id !== "꽝"}
        <text
          class="reward-item"
          font-size="4"
          fill="white"
          y={122 - 10}
          text-anchor="middle"
          dominant-baseline="middle">{reward.id}</text
        >
      {/if}
    {:else}
      {#each { length: reward.quantity } as _, i}
        {@const index = Math.min(3, (i / 7) | 0)}
        {@const size = (7 - index) * 2}
        {@const x = Math.random() * size * 2 - size}
        {@const y = Math.random() * 2 - 1 - index * 2}
        <image
          class="reward-money"
          style="animation-delay:{i * dropDelay}ms"
          x={-6 + x}
          y={115 - 6 + y}
          width="12"
          height="12"
          href={reward.type === "chips" ? chipSrc : tokenSrc}
        />
      {/each}
    {/if}
  </g>
{/if}

<style lang="scss">
  .roulette-vent {
    fill: var(--slate-12);
    stroke: url(#roulette-vent_inset);
  }
  .reward-item {
    transform: translateY(0);
    animation: reward-item 5s ease-in;
  }
  .reward-money {
    animation: reward-money 0.1s ease-in forwards;
  }
  @keyframes -global-reward-money {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(20px);
    }
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
</style>
