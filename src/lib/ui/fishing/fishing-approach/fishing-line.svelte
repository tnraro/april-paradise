<script lang="ts">
  import { FishingState } from "../fishing-state.svelte";

  interface Props {
    x: number;
    y: number;
    s: FishingState;
  }
  let { x, y, s }: Props = $props();
</script>

{#if s === FishingState.Waiting || s === FishingState.Approaching}
  <path class="line" d="M-60-30 Q {x - 10} 12 {x} {y}" />
{:else if s === FishingState.Biting}
  <path class="line" d="M-60-30 L {x} {y}" />
{/if}

<circle class="float__body" cx={x} cy={y + 3} r="1.2" />
<path
  class="float__head"
  d="M {x} {y} L {x + 1.2} {y + 3} L {x - 1.2} {y + 3} z"
/>

<style lang="scss">
  .line {
    stroke: white;
    stroke-width: 0.5;
    fill: transparent;
  }
  .float {
    &__body {
      fill: white;
    }
    &__head {
      fill: var(--red-9);
    }
  }
</style>
