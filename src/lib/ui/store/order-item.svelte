<script lang="ts">
  import Icon from "$img/icon.svelte";
  import InventoryItemImage from "../inventory/inventory-item-image.svelte";

  interface Props {
    key: string;
    quantity: number;
    oninput?: (value: number) => void;
    ondelete?: () => void;
  }
  let { key, quantity = $bindable(), oninput, ondelete }: Props = $props();
</script>

<div class="order-item">
  <InventoryItemImage {key} />
  <div class="footer">
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
    <button class="red trash" onclick={ondelete}>
      <Icon as="trash2" size={16} />
    </button>
  </div>
</div>

<style lang="scss">
  .order-item {
    display: grid;
    justify-items: center;
    gap: 0.25rem;
  }
  .footer {
    display: grid;
    width: 6rem;
    grid-template-columns: 1fr max-content;
    gap: 0.5rem;
  }
  .quantity {
    text-align: right;
  }
  .trash {
    align-items: center;
  }
</style>
