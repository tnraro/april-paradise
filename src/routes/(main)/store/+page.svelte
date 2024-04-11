<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { api } from "$lib/api/api.gen";
  import { groupBy } from "$lib/shared/util/group-by";
  import { sendError } from "$lib/ui/error/send-error.js";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import Drawer from "$lib/ui/floating/drawer.svelte";
    import InventoryItemImage from "$lib/ui/inventory/inventory-item-image.svelte";
  import Chips from "$lib/ui/item/chips.svelte";
  import Tokens from "$lib/ui/item/tokens.svelte";
  import OrderItem from "$lib/ui/store/order-item.svelte";
  import StoreItem from "$lib/ui/store/store-item.svelte";
  import Tab from "$lib/ui/tab/tab.svelte";

  const L = (category: string) => {
    switch (category) {
      case "lure":
        return "미끼";
      case "ingredient":
        return "재료";
      case "misc":
        return "기타";
    }
  };
  const enum OrderState {
    Idle,
    Prepare,
    Pending,
  }
  let { data } = $props();

  let cart = $state.frozen(new Map<string, number>());

  let orderState = $state<OrderState>(OrderState.Idle);

  let error = $state<string>();

  let categories = $derived([
    ...groupBy(data.storeData, (store) => store.category),
  ]);
  let itemMap = $derived(new Map(data.storeData.map(item => [item.key, item])));

  let sum = $derived([...cart].reduce((o, [key, quantity]) => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const item = itemMap.get(key)!;

    if (item.price.type === "chips") {
      return {
        chips: o.chips + item.price.quantity * quantity,
        tokens: o.tokens,
      };
    }
    if (item.price.type === "tokens") {
      return {
        chips: o.chips,
        tokens: o.tokens + item.price.quantity * quantity,
      };
    }
    return o;
  }, {
    chips: 0,
    tokens: 0,
  }));
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
      {@const quantity = cart.get(item.key) ?? 0}
      {@const stock = item.stock ? (item.stock - (data.inventory[item.key] ?? 0)) : undefined}
      <StoreItem
        {...item}
        {stock}
        {quantity}
        onadd={() => {
          const map = new Map(cart);
          const value = map.get(item.key) ?? 0;
          map.set(item.key, value + 1);
          cart = map;
        }}
      />
    {/each}
  </div>
{/snippet}

{#if orderState === OrderState.Idle}
  <main>
    <h1>상점</h1>
    <Tab prefix="store" n={categories.length} {tab} {tabpanel} />
    <div class="store__footer" />
  </main>

  {#if cart.size > 0}
    <Drawer>
      <div class="order__layout">
        <div class="order__list">
          {#each cart as [key, quantity] (key)}
            {@const item = itemMap.get(key)!}
            {@const stock = (item.stock ?? Number.POSITIVE_INFINITY) - (data.inventory[key] ?? 0)}
            <OrderItem
              {key}
              quantity={quantity}
              oninput={(value) => {
                const map = new Map(cart);
                map.set(item.key, Math.max(Math.min(value, stock), 1));
                cart = map;
              }}
              ondelete={() => {
                const map = new Map(cart);
                map.delete(item.key);
                cart = map;
              }}
            />
          {/each}
        </div>
        <div class="order__sum">
          <div>
            <h1 class="order__title">합계</h1>
            {#if sum.chips > 0}
              <Chips quantity={sum.chips} />
            {/if}
            {#if sum.tokens > 0}
              <Tokens quantity={sum.tokens} />
            {/if}
          </div>
          <button class="blue emphasis" onclick={async () => {
            orderState = OrderState.Prepare;
          }}>주문하기</button>
        </div>
      </div>
    </Drawer>
  {/if}
{:else if orderState === OrderState.Prepare}
  <main>
    {#each cart as [key, quantity] (key)}
      <div>
        <InventoryItemImage {key} />
      </div>
    {/each}
  </main>
{/if}

{#if error}
  <Dialog onclose={() => (error = undefined)}>
    {error}
    <button onclick={() => (error = undefined)}>닫기</button>
  </Dialog>
{/if}

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
  :global(.store__tablist) {
    display: flex;
    border-radius: 0.5rem;
    background: var(--slate-3);
    padding: 0.25rem 0.5rem;
    gap: 0.25rem;
  }
  :global(.store__tab[aria-selected="true"]) {
    background: var(--slate-5);
  }
  .store__footer {
    height: 100vh;
  }
  .order {
    &__layout {
      display: grid;
      grid-template-columns: 1fr 6rem;
      gap: 1rem;
    }
    &__list {
      display: grid;
      grid-template-columns: repeat(auto-fill, 6rem);
      gap: 1rem;
    }
    &__sum {
      display: grid;
      grid-template-rows: 1fr max-content;
    }
    &__title {
      font-size: 1rem;
      line-height: 1.5;
    }
  }
</style>
