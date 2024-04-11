<script lang="ts">
  import Icon from "$img/icon.svelte";
  import type { Money } from "$lib/data/sheets/model";
  import InventoryItemImage from "../inventory/inventory-item-image.svelte";
  import AnimatingMoney from "../item/animating-money.svelte";

  interface Props {
    key: string;
    name: string;
    stock: number;
    price: Money;
    quantity: number;

    onquantityinput?: (value: number) => void;
    ondelete?: () => void;
  }
  let {
    key,
    name,
    stock,
    price,
    quantity = $bindable(),
    onquantityinput,
    ondelete,
  }: Props = $props();
</script>

<div class="order-list-item">
  <div class="_header">
    <div class="_">
      <h1 class="name">{name}</h1>
      <p class="description">
        가격: {price.type === "chips" ? "칩" : "토큰"}
        {price.quantity}
      </p>
    </div>
    <InventoryItemImage {key} />
  </div>
  <div class="_footer">
    <AnimatingMoney type={price.type} quantity={price.quantity * quantity} />
    <button class="red trash" onclick={ondelete}>
      <Icon as="trash2" size={16} />
    </button>
    <input
      class="n quantity"
      type="number"
      value={quantity}
      min="0"
      max={stock}
      oninput={(e) => {
        quantity = Math.max(0, Math.min(stock, Number(e.currentTarget.value)));
        onquantityinput?.(quantity);
      }}
    />
  </div>
</div>

<style lang="scss">
  .order-list-item {
    display: grid;
    gap: 0.5rem;
    padding: 0.25rem;
  }
  ._header {
    display: grid;
    grid-template-columns: 1fr 4rem;
    gap: 0 0.5rem;
  }
  ._footer {
    display: grid;
    grid-template-columns: 1fr max-content max-content;
    gap: 0.5rem;
  }
  ._ {
    display: grid;
  }
  .name {
    font-size: 1rem;
    line-height: 1.5;
  }
  .description {
    color: var(--slate-11);
  }
  .n {
    text-align: right;
    max-width: 6rem;
  }
  .trash {
    align-items: center;
  }
</style>
