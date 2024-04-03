<script lang="ts">
  import { getItems } from "$img/imgs";
  import { Tooltip } from "bits-ui";
  import type { Snippet } from "svelte";

  interface Props {
    key: string;
    quantity: number;
    name?: string;
    children?: Snippet;
  }
  let { key, quantity, name, children }: Props = $props();

  let hasItem = $derived(quantity !== 0);

  let src = $state<string>();

  $effect(() => {
    getItems(key)?.then((x) => {
      src = x.default;
    });
  });
</script>

{#snippet image()}
  {#if src}
    <enhanced:img class="item__img pixel" class:item--silhouette={!hasItem} {src} />
  {:else}
    <enhanced:img class="item__img pixel" class:item--silhouette={!hasItem} src="$img/items/sample-fish.png?w=64" />
  {/if}
{/snippet}

<div class="item">
  {#if hasItem}
    <Tooltip.Root openDelay={0} disableHoverableContent={true}>
      <Tooltip.Trigger class="inventory-item__trigger">
        {@render image()}
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" sideOffset={4}>
        {#if children}
          {@render children()}
        {/if}
      </Tooltip.Content>
    </Tooltip.Root>
  {:else}
    {@render image()}
  {/if}
  {#if name}
    <div class="item__name">{hasItem ? name : "???"}</div>
  {/if}
  {#if hasItem}
    <div class="item__quantity">{quantity}</div>
  {/if}
</div>

<style lang="scss">
  .item {
    display: grid;
    grid-template-rows: 64px max-content;
    /* overflow: hidden; */
    &__img {
      width: 64px;
      height: 64px;
      border-radius: 0.5rem;
    }
    &__quantity {
      color: var(--slate-12);
      text-align: center;
    }
    &__name {
      font-size: 0.75rem;
      word-break: keep-all;
      text-align: center;
    }
    &--silhouette {
      filter: contrast(0) brightness(0.5);
    }
  }
  :global(.inventory-item__trigger) {
    padding: 0;
    background: transparent;
    cursor: help;
  }
</style>
