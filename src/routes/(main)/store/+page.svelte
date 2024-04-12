<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Icon from "$img/icon.svelte";
  import { api } from "$lib/api/api.gen.js";
  import { groupBy } from "$lib/shared/util/group-by";
  import { sendError } from "$lib/ui/error/send-error.js";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import Drawer from "$lib/ui/floating/drawer.svelte";
  import InventoryItemImage from "$lib/ui/inventory/inventory-item-image.svelte";
  import AnimatingMoney from "$lib/ui/item/animating-money.svelte";
  import Chips from "$lib/ui/item/chips.svelte";
  import OrderItem from "$lib/ui/store/order-item.svelte";
  import OrderListItem from "$lib/ui/store/order-list-item.svelte";
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
  }
  let { data } = $props();

  let cart = $state.frozen(new Map<string, number>());
  let tickets = $state(0);

  let orderState = $state<OrderState>(OrderState.Idle);

  let error = $state<string>();

  let categories = $derived([
    ...groupBy(data.storeData, (store) => store.category),
  ]);
  let itemMap = $derived(new Map(data.storeData.map(item => [item.key, item])));

  let sortedCart = $derived([...cart].reduce((arr, [key, quantity]) => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const item = itemMap.get(key)!;
    for (let i = 0; i < quantity; i++) {
      arr.push({
        key,
        price: item.price.quantity,
      });
    }
    return arr;
  }, [] as { key: string, price: number }[]).sort((a, b) => b.price - a.price));

  let discountedItems = $derived(sortedCart.slice(0, tickets));
  let restItems = $derived(sortedCart.slice(tickets));

  let totalDiscounted = $derived(discountedItems.reduce((sum, b) => sum + b.price, 0));
  let totalPrice = $derived(restItems.reduce((sum, b) => sum + b.price, 0));

  let havingTickets = $derived(data.inventory["roulette-result-6"] ?? 0);

  let pending = $state(false);
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
        <div class="order__list scroll-area">
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
            <Chips quantity={totalPrice} />
          </div>
          <button class="blue emphasis" onclick={async () => {
            orderState = OrderState.Prepare;
          }}>주문하기</button>
        </div>
      </div>
    </Drawer>
  {/if}
{:else if orderState === OrderState.Prepare}
  <main class="prepare">
    <div class="prepare__sections scroll-area">
      <div class="prepare__section">
        {#each cart as [key, quantity] (key)}
          {@const item = itemMap.get(key)!}
          {@const havingItems = data.inventory[key] ?? 0}
          {@const stock = (item.stock ?? Number.POSITIVE_INFINITY) - havingItems}
          <OrderListItem
            {...item}
            {quantity}
            {stock}
    
            onquantityinput={(value) => {
              const map = new Map(cart);
              map.set(item.key, value);
              cart = map;
            }}
            ondelete={() => {
              const map = new Map(cart);
              map.delete(item.key);
              cart = map;
            }}
          />
        {/each}
        <button onclick={() => orderState = OrderState.Idle}>추가하기</button>
      </div>
      <div class="prepare__section">
        <h1 class="prepare__title"><InventoryItemImage key="roulette-result-6" size={24} pixel={false} />아이템 교환권</h1>
        <div>
          <input
            type="number"
            min="0"
            max={havingTickets}
            bind:value={tickets}
          />
          /
          {havingTickets}
        </div>
        {#each discountedItems as item}
          {@const i = itemMap.get(item.key)!}
          <div class="prepare__discounted-item">
            <InventoryItemImage key={item.key} size={24} pixel={false} />
            <div>{i.name}</div>
            <div>{-item.price}칩</div>
          </div>
        {/each}
      </div>
      <div class="prepare__section">
        <div class="prepare__row">
          <h1 class="prepare__title">결제금액</h1>
          <AnimatingMoney type="chips" quantity={totalPrice} />
        </div>
        <hr />
        <div class="prepare__row">
          <div>주문금액</div>
          <div>{totalPrice + totalDiscounted}칩</div>
        </div>
        {#if totalDiscounted > 0}
          <div class="prepare__row">
            <div>아이템 교환권</div>
            <div>{-totalDiscounted}칩</div>
          </div>
        {/if}
      </div>
      <div class="prepare__footer">
        <button onclick={() => orderState = OrderState.Idle}>돌아가기</button>
        <button
          class="prepare__submit blue emphasis"
          onclick={async () => {
            const body = {
              items: [...cart].map(([key, quantity]) => ({ key, quantity })),
              tickets: discountedItems.map(x => x.key),
            }
            pending = true;
            const res = await api().store.post(body);
            if (!res.ok) {
              try {
                sendError(res.error.message);
              } catch (_) {}
              error = res.error.message;
              orderState = OrderState.Prepare;
            } else {
              orderState = OrderState.Idle;
              cart = new Map();
              tickets = 0;
              invalidateAll();
            }
            pending = false;
          }}
          disabled={pending}
        >
          결제하기
          {#if pending}
            <div class="animate-spin">
              <Icon as="loader-circle" />
            </div>
          {/if}
        </button>
      </div>
    </div>
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
    margin: 0 auto;
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
      max-height: 10rem;
      padding: 0.25rem;
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
  .prepare {
    display: grid;
    grid-template-rows: 1fr max-content;
    height: 100%;
    &__section {
      display: grid;
      border: 1px solid var(--slate-6);
      border-radius: 1rem;
      padding: 1rem;
      gap: 1rem;

      &s {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
    }
    &__footer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }
    &__title {
      font-size: 1rem;
      line-height: 1.5;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    &__discounted-item {
      display: grid;
      grid-template-columns: max-content 1fr max-content;
    }
    &__row {
      display: grid;
      grid-template-columns: 1fr max-content;
    }
    &__submit {
      justify-content: space-between;
    }
  }
</style>
