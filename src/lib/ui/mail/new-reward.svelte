<script lang="ts">
  import type { ItemData } from "$lib/data/sheets/model";
  import { groupBy } from "$lib/shared/util/group-by";

  const I = (s: string) => {
    switch (s) {
      case "money":
        return "돈";
      case "ticket":
        return "티켓";
      case "ingredient":
        return "재료";
      case "cocktail":
        return "칵테일";
    }
  };

  interface Props {
    items: ItemData[];
    onclose?: (reward?: { item: string, quantity: number }) => void;
  }
  let { items, onclose }: Props = $props();
  let categoriesItems = $derived(groupBy(items, (item) => item.category));

  let category = $state("money");
  let item = $state("token");
  let quantity = $state(1);

  $effect(() => {
    if (category) {
      const items = new Set(
        categoriesItems.get(category)?.map(x => x.key) ?? []
      )

      if (!items.has(item)) {
        item = items.values().next().value;
      }
    }
  });
</script>

<form class="_" onreset={(e) => {
  e.preventDefault();
  quantity = 1;
  category = "money";
  item = "token";
  onclose?.();
}} onsubmit={(e) => {
  e.preventDefault();
  onclose?.({ item, quantity });
}}>
  <h1>새 보상</h1>
  <div class="body">
    <select bind:value={category}>
      {#each categoriesItems as [key] (key)}
        <option value={key}>{I(key)}</option>
      {/each}
    </select>
    <select bind:value={item}>
      {#each categoriesItems.get(category)! as item (item.key)}
        <option value={item.key}>{item.name}</option>
      {/each}
    </select>
    <label for="new-reward__input">수량</label>
    <input
      id="new-reward__input"
      type="number"
      placeholder="수량"
      bind:value={quantity}
      min={1}
      required
    />
  </div>
  <div class="footer">
    <button type="reset">취소</button>
    <button class="blue emphasis">추가</button>
  </div>
</form>

<style lang="scss">
  ._ {
    display: grid;
    gap: 1rem;
  }
  .body {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.5rem;
    align-items: center;
  }
  .footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
</style>