<script lang="ts">
  let { data } = $props();
</script>

<h1>목차</h1>
<div class="_">
  <div class="__title">키</div>
  <div class="__title">이름</div>
  {#each data.index as row (row.key)}
    <a href="/preview/data/{row.key}">{row.key}</a>
    <div>{row.name}</div>
  {/each}
</div>

<style>
  ._ {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: 0.25rem 0.5rem;
    align-items: center;
  }
</style>
