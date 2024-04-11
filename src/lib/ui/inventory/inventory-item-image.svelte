<script lang="ts">
  import { getItems } from "$img/imgs";

  interface Props {
    key: string;
    /**
     * @default false
     */
    silhouette?: boolean;
    /**
     * @default true
     */
    pixel?: boolean;
    size?: number;
  }
  let { key, pixel = true, silhouette = false, size = 64 }: Props = $props();

  let src = $state<string>();

  $effect(() => {
    getItems(key)?.then((x) => {
      src = x.default;
    });
  });
</script>

{#if src}
  <enhanced:img
    class="img"
    class:pixel
    class:silhouette
    {src}
    style:---size="{size}px"
  />
{:else}
  <enhanced:img
    class="img pixel"
    class:silhouette
    src="$img/items/sample-fish.png?w=64"
    style:---size="{size}px"
  />
{/if}

<style lang="scss">
  .img {
    width: var(---size);
    height: var(---size);
    border-radius: 0.5rem;
  }
  .silhouette {
    filter: contrast(0) brightness(0.5);
  }
</style>
