<script lang="ts">
  import AnimatingMoney from "$lib/ui/item/animating-money.svelte";
  import { useWallet } from "./wallet.svelte.js";

  let { children, data } = $props();
  const wallet = useWallet(data.user);
  $effect(() => wallet.update(data.user));
</script>

<div class="_">
  <div>
    <header class="header">
      <a href="/">4월의 낙원호</a>
      <div class="user">
        {#if data.user}
          <div class="money">
            <AnimatingMoney type="tokens" quantity={wallet.tokens} />
            <AnimatingMoney type="chips" quantity={wallet.chips} />
          </div>
          <span>{data.user.name}</span>
        {:else}
          <a class="sign-in" href="/auth/sign-in">로그인</a>
        {/if}
      </div>
    </header>
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
  .header {
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
  .user {
    display: flex;
    gap: 1rem;
    background: var(--slate-2);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
  .money {
    display: flex;
    gap: 0.5rem;
  }
  .sign-in {
    text-decoration: none;
  }
</style>
