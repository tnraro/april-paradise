<script lang="ts">
  import Icon from "$img/icon.svelte";
  import type { Money } from "$lib/data/sheets/model";
  import InventoryItemImage from "../inventory/inventory-item-image.svelte";
  import AnimatingMoney from "../item/animating-money.svelte";

  interface Props {
    key: string;
    // name: string;
    stock: number;
    price: Money;
    quantity: number;
    tickets: number;

    onquantityinput?: (value: number) => void;
    onticketinput?: (value: number) => void;
    ondelete?: () => void;
  }
  let {
    key,
    stock,
    price,
    quantity,
    tickets,
    onquantityinput,
    onticketinput,
    ondelete,
  }: Props = $props();
</script>

<div class="order-list-item">
  <InventoryItemImage {key} />
  <div class="_content">
    <div class="name">수량</div>
    <div class="name">아이템 교환권</div>
    <input
      class="n quantity"
      type="number"
      value={quantity}
      min="0"
      max={stock}
      oninput={(e) => {
        const quantity = Math.max(0, Math.min(stock, Number(e.currentTarget.value)));
        onquantityinput?.(quantity);
      }}
    />
    <input
      class="n tickets"
      type="number"
      value={tickets}
      min="0"
      max={quantity}
      oninput={(e) => {
        const tickets = Math.max(
          0,
          Math.min(quantity, Number(e.currentTarget.value)),
        );
        console.log(tickets)
        onticketinput?.(tickets);
      }}
    />
  </div>
  <button class="red trash" onclick={ondelete}>
    <Icon as="trash2" size={16} />
  </button>
  <div class="_footer">
    <AnimatingMoney
      type={price.type}
      quantity={price.quantity * (quantity - tickets)}
    />
  </div>
</div>

<style lang="scss">
  .order-list-item {
    display: grid;
    grid-template-columns: 4rem 1fr max-content;
    gap: 0.5rem;
    align-items: center;
  }
  ._content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 0 0.5rem;
  }
  ._footer {
    display: flex;
    align-items: center;
    justify-content: end;
    grid-column: 1 / 4;
  }
  .name {
    font-size: 1rem;
  }
  .times {
    grid-row: 1 / 3;
  }
  .n {
    text-align: right;
  }
</style>
