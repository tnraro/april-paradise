<script lang="ts">
  import type { LureData } from "$lib/data/sheets/model";
  import Lure from "../item/lure.svelte";

  interface Props {
    lure: LureData;
    onclick?: () => void;
  }
  let { lure, onclick }: Props = $props();
</script>

<button class="lure" {onclick}>
  <Lure lure={lure.key} />
  <div class="lure__name">{lure.name}</div>
  <div>
    <enhanced:img src="$img/exchange.png?w=24" />
  </div>
  <div class="lure__price">
    <enhanced:img src="$img/chip.png?w=24" />
    ×{lure.price.quantity}
  </div>
</button>

<style lang="scss">
  .lure {
    display: grid;
    grid-template-columns: max-content 1fr max-content max-content;
    align-items: center;
    padding: 0.5rem;
    gap: 0.5rem;
    border: 4px solid var(--blue-8);
    background: var(--blue-12);
    color: var(--blue-4);
    & :global(img.lure) {
      width: 2rem;
      height: 2rem;
    }
    &__price {
      display: flex;
      align-items: center;
    }
    &:hover {
      border: 4px solid var(--blue-7);
    }
    &:active,
    &[disabled] {
      border: 4px solid var(--blue-6);
      background: var(--blue-11);
    }
  }
</style>
