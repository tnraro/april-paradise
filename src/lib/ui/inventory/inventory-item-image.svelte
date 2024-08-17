<script lang="ts">
  import { getItems } from "$img/items.gen";

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

  let src = $derived(getItems(key));
</script>

{#if src != null}
  <enhanced:img
    alt=""
    class="img"
    class:pixel
    class:silhouette
    {src}
    style:---size="{size}px"
  />
{:else}
  <enhanced:img
    alt=""
    class="img"
    class:pixel
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
  @keyframes -global-skeleton {
    0% {
      background: var(--slate-6);
    }
    50% {
      background: var(--slate-7);
    }
    100% {
      background: var(--slate-6);
    }
  }
</style>
