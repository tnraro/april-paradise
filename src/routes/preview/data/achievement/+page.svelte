<script lang="ts">
  import Item from "$lib/ui/item/item.svelte";

  let { data } = $props();
</script>

<h1>{data.name}</h1>
<div class="_">
  <div class="title">키</div>
  <div class="title">이름</div>
  <div class="title">조건</div>
  <div class="title">보상</div>
  {#each data.data as row (row.key)}
    <div class="key" title={row.key}>{row.key}</div>
    <div>
      {row.name}
      {#if row.isHidden}
        <span>(히든)</span>
      {/if}
    </div>
    <div>{row.condition}</div>
    <Item item={row.reward} />
  {/each}
</div>

<style>
  ._ {
    display: grid;
    grid-template-columns: repeat(4, max-content);
    gap: 0.25rem 0.5rem;
    align-items: center;
  }
</style>
