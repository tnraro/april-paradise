<script lang="ts">
  import { getItems } from "$img/imgs";
  import { Tooltip } from "bits-ui";
  import type { Snippet } from "svelte";

  interface Props {
    key: string;
    quantity: number;
    children?: Snippet;
  }
  let { key, quantity, children }: Props = $props();

  let src = $state<string>();

  $effect(() => {
    getItems(key)?.then((x) => {
      src = x.default;
    });
  });
</script>

<div class="item">
  <Tooltip.Root openDelay={0} disableHoverableContent={true}>
    <Tooltip.Trigger class="inventory-item__trigger">
      {#if src}
        <enhanced:img class="item__img pixel" {src} />
      {:else}
        <enhanced:img class="item__img pixel" src="$img/items/sample-fish.png?w=64" />
      {/if}
    </Tooltip.Trigger>
    <Tooltip.Content side="bottom" sideOffset={4}>
      {#if children}
        {@render children()}
      {/if}
    </Tooltip.Content>
  </Tooltip.Root>
  <div class="item__quantity">{quantity}</div>
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
  }
  :global(.inventory-item__trigger) {
    padding: 0;
    background: transparent;
    cursor: help;
  }
</style>
