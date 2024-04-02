<script lang="ts">
  import { State } from "./types";

  interface Props {
    x: number;
    y: number;
    state: State;
  }
  let { x, y, state }: Props = $props();
</script>

{#if state === State.Waiting}
  <path class="line" d="M-60-30 Q {x - 10} 12 {x} {y}" />
{:else if state === State.Biting}
  <path class="line" d="M-60-30 L {x} {y}" />
{/if}

<!-- <path class="float__anchor" d="M{x} {y + 3} L {x} {y + 5 + l} C {x + 2} {y + 6 + l} {x} {y + 8 + l} {x - 1} {y + 6 + l}" /> -->
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
    &__anchor {
      stroke: black;
      stroke-width: 0.5;
      fill: transparent;
    }
  }
</style>
