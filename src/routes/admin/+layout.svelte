<script lang="ts">
  import Icon from '$img/icon.svelte';
  import { useItemData } from '$lib/ui/data/data.svelte.js';
  import { Menubar } from 'bits-ui';

  let { children, data } = $props();

  useItemData(data.itemData);
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
    <Menubar.Root>
      {data.admin.key}
      <Menubar.Menu>
        <Menubar.Trigger>
          <Icon as="menu" />
        </Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item href="/">
            <Icon as="home" stroke-width={1} />메인으로
          </Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item href="/auth/sign-out">
            <Icon as="log-out" stroke-width={1} />로그아웃
          </Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  </div>
</header>

{@render children()}

<style lang="scss">
  header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    align-items: center;
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
  }
</style>
