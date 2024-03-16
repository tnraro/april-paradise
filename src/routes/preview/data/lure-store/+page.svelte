<script lang="ts">
  import Item from "$lib/ui/item/item.svelte";

  let { data } = $props();
</script>

<h1>{data.name}</h1>
<div class="_">
  <div class="title">키</div>
  <div class="title">이름</div>
  <div class="title">가격</div>
  {#each data.data as row (row.key)}
    <div class="key" title={row.key}>{row.key}</div>
    <div>{row.name}</div>
    <Item item={row.price} />
  {/each}
</div>

<style>
  ._ {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: 0.25rem 0.5rem;
    align-items: center;
  }
</style>
