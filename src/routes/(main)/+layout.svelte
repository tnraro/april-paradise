<script lang="ts">
  import Icon from "$img/icon.svelte";
  import { useItemData } from "$lib/ui/data/data.svelte.js";
  import AnimatingMoney from "$lib/ui/item/animating-money.svelte";
  import { Menubar } from "bits-ui";
  import { useWallet } from "./wallet.svelte.js";

  let { children, data } = $props();
  const wallet = useWallet(data.user);
  $effect(() => wallet.update(data.user));
  useItemData(data.itemData);
</script>

<div class="_">
  <div>
    <Menubar.Root class="layout-menubar">
      <a href="/">4월의 낙원호</a>
      {#if data.user}
        <Menubar.Menu>
          {#if data.user.mails > 0}
            <span class="badge badge--mail"></span>
          {/if}
          <div class="money">
            <AnimatingMoney type="tokens" quantity={wallet.tokens} />
            <AnimatingMoney type="chips" quantity={wallet.chips} />
          </div>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger class="layout-menubar__user">
            <Icon as="menu" />
          </Menubar.Trigger>
          <Menubar.Content align="end" sideOffset={6}>
            <Menubar.Item>
              {data.user.name}
            </Menubar.Item>
            <Menubar.Item href="/mails" class="layout-menubar__item">
              {#if data.user.mails > 0}
                <span class="badge badge--mail"></span>
              {/if}
              우편함
            </Menubar.Item>
            {#if data.user.isAdmin}
              <Menubar.Item href="/admin">관리 페이지</Menubar.Item>
            {/if}
            <Menubar.Separator />
            <Menubar.Item href="/auth/sign-out">
              로그아웃
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      {:else}
        <a class="sign-in" href="/auth/sign-in">로그인</a>
      {/if}
    </Menubar.Root>
  </div>

  <div class="__">
    {@render children()}
  </div>
</div>

<style lang="scss">
  ._ {
    display: grid;
    grid-template-rows: 2.625rem 1fr;
    height: 100%;
  }
  .__ {
    overflow: auto;
  }
  :global(.layout-menubar) {
    display: flex;
    position: fixed;
    top: 0;
    width: 100%;
    justify-content: space-between;
    padding: 0.25rem 2rem;
    align-items: center;
    background: white;
    border-bottom: 2px solid var(--slate-3);
  }
  :global(.layout-menubar__user) {
    display: flex;
    gap: 1rem;
    position: relative;
  }
  :global(.layout-menubar__item) {
    position: relative;
  }
  .money {
    display: flex;
    gap: 0.5rem;
  }
  .sign-in {
    text-decoration: none;
  }
  .badge {
    position: absolute;

    &--mail {
      background: var(--red-9);
      color: white;
      border-radius: 99999rem;
      width: 0.5rem;
      height: 0.5rem;
      transform: translate(-100%, -80%);
    }
  }
</style>
