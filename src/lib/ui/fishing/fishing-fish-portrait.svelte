<script lang="ts">
  import type { CaughtFish } from "./fishing-state.svelte";

  interface Props {
    fish: Pick<CaughtFish, "key">;
    silhouette?: boolean;
  }
  let { fish, silhouette = false } = $props<Props>();
</script>

<enhanced:img
  class="fish pixel"
  class:fish--silhouette={silhouette}
  src="$img/sample-fish.png?w=64"
/>

<style lang="scss">
  .fish {
    &--silhouette {
      filter: brightness(0);
    }
  }
</style>
