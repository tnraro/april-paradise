<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Icon from "$img/icon.svelte";
  import { api } from "$lib/api/api.gen.js";
  import AsyncButton from "$lib/ui/data/async-button.svelte";
  import Chips from "$lib/ui/item/chips.svelte";
  import Tokens from "$lib/ui/item/tokens.svelte";

  let { data } = $props();
</script>

<main>
  {#if data.user}
    <h1>{data.user.name}</h1>
    <section>
      <Tokens quantity={data.user.tokens} />
      <Chips quantity={data.user.chips} />
      <AsyncButton
        text="출석체크"
        done={data.attendance}
        onclick={async () => {
          const res = await api().runners.attendance.post(undefined);
          if (!res.ok) {
            throw res;
          }
          await invalidateAll();
        }}
      />
    </section>
    <a href="/mails">
      <section>
        <h2>
          <Icon as="inbox" />우편함
        </h2>
        {#if data.user.mails > 0}
          <span class="description">새 우편 {data.user.mails} 건</span>
        {:else}
          <span class="description">새 우편이 없습니다</span>
        {/if}
      </section>
    </a>
    <a href="/inventory">
      <section>
        <h2>
          <Icon as="package2" />가방
        </h2>
      </section>
    </a>
  {/if}
</main>

<style lang="scss">
  @use "$lib/ui/styles/mixin";
  main {
    width: min(20rem, 100vw);
    margin: 0 auto;
    display: grid;
    padding: 1rem;
    gap: 1rem;
  }
  .description {
    color: var(--slate-11);
  }
  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  a {
    display: block;
    text-decoration: none;
    &:hover {
      background: var(--blue-2);
    }
  }
  section {
    @include mixin.select-none;
    padding: 0.5rem;
    border-radius: 0.25rem;
    display: grid;
    gap: 0.25rem;
  }
</style>
