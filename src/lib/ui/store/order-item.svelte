<script lang="ts">
  import InventoryItemImage from "../inventory/inventory-item-image.svelte";

  interface Props {
    key: string;
    quantity: number;
    oninput?: (value: number) => void;
  }
  let { key, quantity = $bindable(), oninput }: Props = $props();
</script>

<div class="order-item">
  <InventoryItemImage {key} />
  <input
    class="quantity"
    type="number"
    value={quantity}
    min="1"
    oninput={(e) => {
      quantity = Number(e.currentTarget.value);
      oninput?.(quantity);
    }}
  />
</div>

<style lang="scss">
  .order-item {
    display: grid;
    justify-items: center;
    gap: 0.25rem;
  }
  .quantity {
    width: 6rem;
    text-align: right;
  }
</style>
