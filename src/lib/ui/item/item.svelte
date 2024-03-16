<script lang="ts">
  import type { Item, Money } from "$lib/data/sheets/model";
  import Chips from "./chips.svelte";
  import Items from "./items.svelte";
  import Tokens from "./tokens.svelte";

  interface Props {
    item: Money | Item;
  }
  let { item } = $props<Props>();
</script>

{#if item}
  {#if item.type === "chips"}
    <Chips quantity={item.quantity} />
  {:else if item.type === "tokens"}
    <Tokens quantity={item.quantity} />
  {:else if item.type === "item"}
    <Items name={item.id} />
  {/if}
{:else}
  <div />
{/if}
