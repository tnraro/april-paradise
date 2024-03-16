<script lang="ts">
  import Item from "$lib/ui/item/item.svelte";

  let { data } = $props();
</script>

<h1>{data.name}</h1>
<div class="_">
  <div class="title">키</div>
  <div class="title">결과</div>
  <div class="title">확률</div>
  {#each data.data as row (row.key)}
    <div class="key" title={row.key}>{row.key}</div>
    <Item item={row.result} />
    <div>{row.probability * 100}%</div>
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
