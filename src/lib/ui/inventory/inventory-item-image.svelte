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

  const enum State {
    Pending,
    Success,
    Failed,
  }

  let _state = $state<State>(State.Pending);

  let src = $state<string>();

  $effect(() => {
    const items = getItems(key);
    if (items == null) {
      _state = State.Failed;
    } else {
      items.then((x) => {
        src = x.default;
        _state = State.Success;
      });
    }
  });
</script>

{#if _state === State.Pending}
  <div class="skeleton" style:---size="{size}px" />
{:else if _state === State.Success}
  <enhanced:img
    class="img"
    class:pixel
    class:silhouette
    {src}
    style:---size="{size}px"
  />
{:else if _state === State.Failed}
  <enhanced:img
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
  .skeleton {
    width: var(---size);
    height: var(---size);
    border-radius: 0.5rem;
    background: transparent;

    animation: skeleton 3s infinite 0.4s;
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
