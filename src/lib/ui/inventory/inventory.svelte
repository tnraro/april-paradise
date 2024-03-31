<script lang="ts">
  import InventoryItem from "./inventory-item.svelte";

  interface Props {
    groups: {
      name: string;
      items: { key: string; quantity: number }[];
    }[];
  }
  let { groups }: Props = $props();
</script>

<div class="inventory">
  {#each groups as group (group.name)}
    <div class="inventory__group">
      <h1>{group.name}</h1>
      <div class="inventory__items">
        {#each group.items as item}
          <InventoryItem {...item} />
        {/each}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .inventory {
    display: grid;
    gap: 2rem;
    &__group {
      display: grid;
      gap: 0.5rem;
    }
    &__items {
      display: grid;
      grid-template-columns: repeat(auto-fit, 64px);
      gap: 1rem;
    }
  }
</style>
