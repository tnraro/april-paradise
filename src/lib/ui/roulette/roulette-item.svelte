<script lang="ts">
  import type { Item, Money } from "$lib/data/sheets/model";
  import { chipSrc, tokenSrc } from "./roulette-resources";

  interface Props {
    item: Item | Money;
    x?: number;
    y?: number;
  }
  let { item, x = 0, y = 0 }: Props = $props();
</script>

<g transform="translate({x} {y})">
  <rect class="slot_bg" x="-28" width="56" height="15"></rect>
  {#if item.type === "tokens"}
    <image x="-25" y="2.5" width="10" height="10" href={tokenSrc}></image>
    <text class="slot_text" x="-12" y="8.5">
      토큰×{item.quantity}
    </text>
  {:else if item.type === "chips"}
    <image x="-25" y="2.5" width="10" height="10" href={chipSrc}></image>
    <text class="slot_text" x="-12" y="8.5">
      칩×{item.quantity}
    </text>
  {:else if item.type === "item"}
    <text class="slot_text" y="8.5" text-anchor="middle">
      {item.id}
    </text>
  {/if}
</g>

<style lang="scss">
  .slot {
    animation: roll 0s linear infinite;
    &_bg {
      fill: white;
    }
    &_text {
      fill: var(--sand-11);
      dominant-baseline: middle;
      font-weight: 700;
      font-size: 8px;
    }
  }
</style>
