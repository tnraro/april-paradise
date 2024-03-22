<script lang="ts">
  let { children, data } = $props();
</script>

<header class="header">
  <a href="/">4월의 낙원호</a>
  <div class="user">
    {#if data.isSignedIn}
      <span class="tokens">
        <enhanced:img class="tokens_img" src="$img/token.png?w=24" />
        {0}
      </span>
      <span class="chips">
        <enhanced:img class="chips_img" src="$img/chip.png?w=24" />
        {0}
      </span>
      <span>러너 이름</span>
    {/if}
  </div>
</header>
{@render children()}

<style lang="scss">
  .header {
    display: flex;
    justify-content: space-between;
  }
  .user {
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
</style>