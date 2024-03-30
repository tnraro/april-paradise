<script lang="ts">
  let { data, children } = $props();
</script>

<header>
  <a href="/stylebook">스타일북</a>
</header>

<div class="_">
  <div class="sidebar">
    목록
    {#each data.sbs as sb}
      <div>
        <a href="/stylebook{sb.path}">{sb.path}</a>
      </div>
    {/each}
  </div>
  
  <div>
    {@render children()}
  </div>
</div>

<style>
  ._ {
    display: grid;
    grid-template-columns: min-content 1fr;
  }
  .sidebar {
    padding: 0 0.5rem;
  }
</style>