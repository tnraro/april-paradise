<script lang="ts">
  import type { Item, Money } from "$lib/data/sheets/model";
  import RouletteItem from "./roulette-item.svelte";

  interface Props {
    table: { key: string; result: Money | Item }[];
    speed: number;
    index: number;
  }
  let { table, speed, index } = $props<Props>();

  let slots = $derived([
    table[index % table.length],
    table[(index + 1) % table.length],
    table[(index + 2) % table.length],
    table[(index + 3) % table.length],
  ]);
</script>

<defs>
  <linearGradient id="slots_shadow" gradientTransform="rotate(90)">
    <stop offset="0%" stop-color="var(--slate-a6)" />
    <stop offset="20%" stop-color="transparent" />
    <stop offset="80%" stop-color="transparent" />
    <stop offset="100%" stop-color="var(--slate-a6)" />
  </linearGradient>
  <clipPath id="slots">
    <rect x="-30" y="44" width="60" height="29" />
  </clipPath>
  <filter id="slots_blur">
    <feGaussianBlur in="SourceGraphic" stdDeviation="0,{speed}" />
  </filter>
</defs>

<rect class="slots_bg" x="-30" y="43" width="60" height="30" />

<rect class="slots_column" x="-48" y="43" width="18" height="32" />
<rect class="slots_column" x="30" y="43" width="18" height="32" />

<g clip-path="url(#slots)">
  <g
    class="slots"
    class:slots--rolling={speed > 0}
    style="animation-duration:{(16 / speed) * 0.01}s"
    onanimationiteration={() => {
      index++;
    }}
  >
    {#each slots as slot, i}
      <RouletteItem item={slot.result} y={36 + i * 16} />
    {/each}
  </g>
</g>

<rect class="slots_shadow" x="-30" y="44" width="60" height="29" />

<style lang="scss">
  .slots {
    &--rolling {
      animation: roll linear infinite;
      filter: url(#slots_blur);
    }
    &_bg {
      fill: var(--sand-12);
    }
    &_column {
      stroke: var(--sand-6);
      fill: var(--red-9);
    }
    &_shadow {
      fill: url(#slots_shadow);
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
