<script lang="ts">
  let { children, data } = $props();
</script>

<nav>
  {#each data.pages as page (page.href)}
    <a href={page.href} aria-current={page.current ? "page" : undefined}>{page.title}</a>
  {/each}
</nav>
{@render children()}

<style lang="scss">
  nav {
    display: flex;
    gap: 1ch;
  }
  :global(.grid) {
    display: grid;
    grid-template-columns: minmax(4rem, max-content) 1fr;
    gap: 0.75rem 1ch;
    align-items: center;
    padding: 1rem;
  }
</style>
