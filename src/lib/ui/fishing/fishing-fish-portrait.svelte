<script lang="ts">
  import { getItems } from "$img/items.gen";
  import type { CaughtFish } from "./fishing-state.svelte";

  interface Props {
    fish: Pick<CaughtFish, "key">;
    silhouette?: boolean;
  }
  let { fish, silhouette = false }: Props = $props();
  let src = $derived(getItems(fish.key));
</script>

{#if src}
  <enhanced:img alt="" class="fish pixel" class:fish--silhouette={silhouette} {src} />
{:else}
  <enhanced:img alt=""
    class="fish pixel"
    class:fish--silhouette={silhouette}
    src="$img/items/sample-fish.png?w=64"
  />
{/if}

<style lang="scss">
  .fish {
    &--silhouette {
      filter: brightness(0);
    }
  }
</style>
