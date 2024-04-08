<script lang="ts">
  let { children, data } = $props();
</script>

<nav>
  <a class="text" href="{data.sheetsUrl}" target="_blank" rel="noreferrer">구글 시트</a>
  
  {#each data.index as index}
    <a href="/admin/static-data/{index.key}">{index.name}</a>
  {/each}
</nav>
<button>데이터 동기화</button>

{@render children()}

<style>
  .text {
    display: flex;
    align-items: center;
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>