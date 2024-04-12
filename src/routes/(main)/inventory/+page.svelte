<script lang="ts">
  import InventoryItem from "$lib/ui/inventory/inventory-item.svelte";
  import Inventory from "$lib/ui/inventory/inventory.svelte";

  const L = (key: string) => {
    switch (key) {
      case "fish": return "물고기";
      case "garbage": return "잡동사니";
      case "ingredient": return "재료";
      case "lure": return "미끼";
      case "misc": return "기타";
      case "ticket": return "티켓";
    }
  }

  let { data } = $props();

  let itemMap = $derived(new Map(data.itemData?.map((x) => [x.key, x]) ?? []));
</script>

<main>
  <h1>가방</h1>
  <div class="scroll-area inventory">
    {#if data.user.inventory.length > 0}
      {#each data.user.inventory as inventory}
        <section>
          <h2>{L(inventory.category)}</h2>
          <Inventory>
            {#each inventory.items as item (item.key)}
              {@const i = itemMap.get(item.key)}
              <InventoryItem
                key={item.key}
                name={i?.name}
                quantity={item.quantity}
              >
                {i?.description}
              </InventoryItem>
            {/each}
          </Inventory>
        </section>
      {/each}
    {:else}
      비어있습니다.
    {/if}
  </div>
</main>

<style lang="scss">
  main {
    width: min(40rem, 100vw);
    margin: 0 auto;
  }
  .inventory {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
</style>