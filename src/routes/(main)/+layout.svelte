<script lang="ts">
  let { children, data } = $props();
</script>

<div class="_">
  <div>
    <header class="header">
      <a href="/">4월의 낙원호</a>
      <div class="user">
        {#if data.isSignedIn}
          <div class="money">
            <span class="tokens">
              <enhanced:img class="tokens_img" src="$img/token.png?w=24" />
              {data.user?.tokens ?? 0}
            </span>
            <span class="chips">
              <enhanced:img class="chips_img" src="$img/chip.png?w=24" />
              {data.user?.chips ?? 0}
            </span>
          </div>
          <span>{data.user?.name ?? "익명"}</span>
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
  .tokens {
    display: flex;
    gap: 0.25rem;
    color: var(--amber-11);
    &_img {
      width: auto;
      height: 1.5rem;
    }
  }
  .chips {
    display: flex;
    gap: 0.25rem;
    color: var(--blue-11);
    &_img {
      width: auto;
      height: 1.5rem;
    }
  }
  .sign-in {
    text-decoration: none;
  }
</style>