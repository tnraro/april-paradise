<script lang="ts">
let { children, data } = $props();
</script>

<nav>
  <a href="/preview/data">목차</a>
  {#each data.index as row (row.key)}
    <a href="/preview/data/{row.key}">{row.name}</a>
  {/each}
</nav>
{@render children()}

<style>
  nav {
    display: flex;
    gap: 1rem;
  }
  :global(.__null) {
    font-style: italic;
    color: var(--slate-9);
    user-select: none;
    -webkit-user-select: none;
  }
  :global(.__key) {
    font-style: italic;
    color: var(--red-11);
    user-select: all;
    -webkit-user-select: all;
    max-width: 6rem;
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
  }
  :global(.__title) {
    font-weight: bold;
    user-select: none;
    -webkit-user-select: none;
  }
</style>
