<script lang="ts">
  import { getImg } from "$img/imgs";
  import { Tooltip } from "bits-ui";

  interface Props {
    key: string;
    quantity: number;
  }
  let { key, quantity }: Props = $props();

  let src = $state<string>();

  $effect(() => {
    getImg(key)?.then((x) => {
      src = x.default;
    });
  });
</script>

{#if src}
  <div class="item">
    <Tooltip.Root openDelay={0} disableHoverableContent={true}>
      <Tooltip.Trigger class="inventory-item__trigger">
        <enhanced:img class="item__img pixel" {src} />
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" sideOffset={4}>
        설명
      </Tooltip.Content>
    </Tooltip.Root>
    <div class="item__quantity">{quantity}</div>
  </div>
{:else}
  <div class="item" />
{/if}

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
