<script lang="ts">
  import { groupBy } from "$lib/shared/util/group-by";
  import InventoryItemImage from "$lib/ui/inventory/inventory-item-image.svelte";
  import Tab from "$lib/ui/tab/tab.svelte";

  const L = (category: string) => {
    switch (category) {
      case "lure":
        return "루어";
      case "ingredient":
        return "재료";
      case "misc":
        return "기타";
    }
  };
  let { data } = $props();

  let categories = $derived([
    ...groupBy(data.storeData, (store) => store.category)
  ]);
</script>

{#snippet tab(index: number)}
  {@const [category] = categories[index]}
  {L(category)}
{/snippet}
{#snippet tabpanel(index: number)}
  {@const [category, items] = categories[index]}
  <h2>{L(category)}</h2>
  <div class="table">
    {#each items as item}
      <div class="item">
        <div class="item__header">
          <InventoryItemImage key={item.key} />
        </div>
        <div class="item__content">
          <div class="item__name">{item.name}</div>
          <div class="item__ornament">
            {Math.round((1 - item.price.quantity / 149) * 100)}%
            <span class="item__ornament--line-through">{149}</span>
          </div>
          {#if item.price.type === "chips"}
            <div class="money money--chips">
              <enhanced:img src="$img/chip.png?w=16" />
              {item.price.quantity}
            </div>
          {:else if item.price.type === "tokens"}
            <div class="money money--tokens">
              <enhanced:img src="$img/token.png?w=16" />
              {item.price.quantity}
            </div>
          {/if}
          <div class="item__ornament--bold">무료 배송</div>
        </div>
        <div class="item__footer">
          <button class="blue">담기</button>
          <!-- <button>교환</button> -->
        </div>
      </div>
    {/each}
  </div>
{/snippet}

<main>
  <h1>상점</h1>
  <div>
    <Tab prefix="store" n={categories.length} {tab} {tabpanel} />
  </div>
</main>

<style lang="scss">
  main {
    margin: 1rem auto;
    width: min(20rem, 100vw);
  }
  .table {
    display: grid;
    grid-template-columns: repeat(auto-fill, 6rem);
    gap: 1rem;
    margin-bottom: 4rem;
  }
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
  :global(.store__tablist) {
    display: flex;
    border-radius: 0.5rem;
    background: var(--slate-3);
    padding: 0.25rem 0.5rem;
    gap: 0.25rem;
  }
  :global(.store__tab[aria-selected=true]) {
    background: var(--slate-5);
  }
</style>
