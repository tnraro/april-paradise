<script lang="ts">
  let { children, data } = $props();
</script>

<header>
  <nav>
    {#each data.pages as page (page.pathname)}
      <a href={page.pathname} aria-current={page.current ? "page" : undefined}
        >{page.title}</a
      >
    {/each}
  </nav>
  <div>
    <span>{data.admin.key}</span>
  </div>
</header>

{@render children()}

<style lang="scss">
  header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
  }
</style>
