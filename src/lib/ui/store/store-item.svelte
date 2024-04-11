<script lang="ts">
  import type { Money } from "$lib/data/sheets/model";
  import InventoryItemImage from "../inventory/inventory-item-image.svelte";

  interface Props {
    key: string;
    name: string;
    price: Money;
    stock?: number;
    quantity?: number;
    onadd?: () => void;
  }
  let { key, name, price, stock, quantity, onadd }: Props = $props();

  let ornament = $derived(Math.round(price.quantity * 0.876) * 10);
</script>

<div class="item">
  <div class="item__header">
    <InventoryItemImage {key} />
  </div>
  <div class="item__content">
    <div class="item__name">{name}</div>
    <div class="item__ornament">
      {Math.round((1 - price.quantity / ornament) * 100)}%
      <span class="item__ornament--line-through">{ornament}</span>
    </div>
    {#if price.type === "chips"}
      <div class="money money--chips">
        <enhanced:img src="$img/chip.png?w=16" />
        {price.quantity}
      </div>
    {:else if price.type === "tokens"}
      <div class="money money--tokens">
        <enhanced:img src="$img/token.png?w=16" />
        {price.quantity}
      </div>
    {/if}
    <div class="item__ornament--bold">무료 배송</div>
    {#if stock != null}
      {#if stock > 0}
        <div class="item__">재고: {stock}</div>
      {:else}
        재고 없음
      {/if}
    {/if}
  </div>
  <div class="item__footer">
    {#if stock == null || quantity == null || stock - quantity > 0}
      <button class="blue" onclick={onadd}>담기</button>
    {:else}
      <button disabled>담기</button>
    {/if}
  </div>
</div>

<style lang="scss">
  .item {
    width: 6rem;
    background: white;
    &__header {
      display: grid;
      justify-content: center;
    }
    &__name {
      font-weight: 700;
      font-size: 1rem;
      word-break: keep-all;
    }
    &__footer {
      display: flex;
      margin-top: 0.5rem;
      gap: 0.5rem;

      & button {
        flex: 1 1 0;
      }
    }
    &__ornament {
      font-size: 0.75rem;
      &--line-through {
        text-decoration: line-through;
        color: var(--slate-8);
      }
      &--bold {
        color: var(--slate-11);
      }
    }
  }
  .money {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    line-height: 0;
    &--chips {
      color: var(--blue-11);
    }
    &--tokens {
      color: var(--yellow-11);
    }
  }
</style>
