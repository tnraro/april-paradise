<script lang="ts">
  import { Tooltip } from "bits-ui";
  import type { Snippet } from "svelte";
  import InventoryItemImage from "./inventory-item-image.svelte";

  interface Props {
    key: string;
    quantity: number;
    name?: string;
    children?: Snippet;
  }
  let { key, quantity, name, children }: Props = $props();

  let hasItem = $derived(quantity !== 0);
</script>

<div class="item">
  {#if hasItem}
    <Tooltip.Root openDelay={0} disableHoverableContent={true}>
      <Tooltip.Trigger class="inventory-item__trigger">
        <InventoryItemImage {key} silhouette={!hasItem} />
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" sideOffset={4}>
        {#if children}
          {@render children()}
        {/if}
      </Tooltip.Content>
    </Tooltip.Root>
  {:else}
    <InventoryItemImage {key} silhouette={!hasItem} />
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
    &__quantity {
      color: var(--slate-12);
      text-align: center;
    }
    &__name {
      font-size: 0.75rem;
      word-break: keep-all;
      text-align: center;
    }
  }
  :global(.inventory-item__trigger) {
    padding: 0;
    background: transparent;
    cursor: help;
  }
</style>
