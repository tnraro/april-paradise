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
  $inspect(data);
  let schedule = $derived.by(() => {
    const now = Date.now();
    return data.scheduleData
      .filter(
        (event) =>
          event.pathname != null &&
          now >= (event.start?.getTime() ?? 0) &&
          now <= (event.end?.getTime() ?? 0),
      )
      .sort((a, b) => a.end.getTime() - b.end.getTime());
  });
</script>

<div class="_">
  <div>
    <Menubar.Root class="layout-menubar">
      <Menubar.Menu>
        <Menubar.Trigger>4월의 낙원호</Menubar.Trigger>
        <Menubar.Content align="end" sideOffset={6}>
          <Menubar.Item href="/">
            <Icon as="home" stroke-width={1} />홈
          </Menubar.Item>
          <Menubar.Item href="/store">
            <Icon as="shopping-cart" stroke-width={1} />상점
          </Menubar.Item>
          <Menubar.Separator />
          {#each schedule as event (event.key)}
            <Menubar.Item href={event.pathname}>{event.title}</Menubar.Item>
          {/each}
        </Menubar.Content>
      </Menubar.Menu>
      {#if data.user}
        <Menubar.Menu>
          <div class="money">
            <AnimatingMoney type="tokens" quantity={wallet.tokens} />
            <AnimatingMoney type="chips" quantity={wallet.chips} />
          </div>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger class="layout-menubar__user">
            {#if data.user.mails > 0}
              <span class="badge badge--mail"></span>
            {/if}
            <Icon as="menu" />
          </Menubar.Trigger>
          <Menubar.Content align="end" sideOffset={6}>
            <Menubar.Item href="/user" >
              <Icon as="user-circle2" stroke-width={1} />{data.user.name}
            </Menubar.Item>
            <Menubar.Item href="/mails" class="layout-menubar__item">
              {#if data.user.mails > 0}
                <span class="badge badge--mail"></span>
              {/if}
              <Icon as="inbox" stroke-width={1} />우편함
            </Menubar.Item>
            <Menubar.Item href="/inventory">
              <Icon as="package2" stroke-width={1} />가방
            </Menubar.Item>
            {#if data.user.isAdmin}
              <Menubar.Separator />
              <Menubar.Item href="/admin">
                <Icon as="wrench" stroke-width={1} />관리 페이지
              </Menubar.Item>
            {/if}
            <Menubar.Separator />
            <Menubar.Item href="/auth/sign-out">
              <Icon as="log-out" stroke-width={1} />로그아웃
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      {:else}
        <a class="sign-in" href="/auth/sign-in">
          <Icon as="log-out" stroke-width={1} />로그인
        </a>
      {/if}
    </Menubar.Root>
  </div>

  <div class="__">
    {@render children()}
  </div>
</div>

<style lang="scss">
  @use "$lib/ui/styles/mixin";
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
    padding: 0.25rem 0.5rem;
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
    @include mixin.select-none;
    display: flex;
    align-items: center;
    color: unset;
    text-decoration: unset;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    gap: 0.5rem;
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
