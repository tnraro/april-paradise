<script lang="ts">
  import { deepEqual } from "$lib/shared/util/deep-equal.js";
  import Alert from "$lib/ui/floating/alert.svelte";

  const reset = () => {
    current = {
      ...data.runner,
    };
  };
  const submit = () => {
    console.log(current);
  };

  let { data } = $props();

  let current = $state({
    ...data.runner,
  });

  let isEqual = $derived(deepEqual(data.runner, current));
</script>

<main>
  <div class="title">
    <h1>{current.name}</h1>
    <a class="x-id" href="https://twitter.com/{current.twitterId}">@{current.twitterId}</a>
  </div>
  <div>
    <h2>자원</h2>
    <span>칩: {current.chips}</span>
    <span>토큰: {current.tokens}</span>
  </div>
  <div>
    <h2>메모</h2>
    <textarea class="memo" bind:value={current.memo}></textarea>
  </div>
  <div class="penalties">
    <div class="penalties-title">경고</div>
    <div class="penalties-title">사유</div>
    {#each current.penalties as penalty (penalty.id)}
      <span
        class="penalty"
        class:penalty--warning={!penalty.isBanned}
        class:penalty--banned={penalty.isBanned}>{penalty.isBanned ? "제명" : "경고"}</span
      >
      <span>{penalty.reason}</span>
    {/each}
  </div>
  <div class="identity">
    계정 {current.hasIdentity ? "" : "안 "}만듦 <button>초대 코드 복사</button>
  </div>
</main>
{#if !isEqual}
  <Alert>
    <div>수정됨</div>
    <button class="blue" type="reset" onclick={reset}>재설정</button>
    <button class="blue emphasis" onclick={submit}>저장</button>
  </Alert>
{/if}

<style lang="scss">
  main {
    display: grid;
    padding: 0 1rem;
    gap: 1rem;
    justify-content: start;
  }
  address {
    font-style: unset;
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    gap: 0.25rem 0.5rem;
  }
  .title {
    & h1 {
      margin-bottom: -0.5rem;
    }
  }
  .alert {
    display: grid;
    position: fixed;
    bottom: 1rem;
    left: 50%;
    width: min(90%, 20rem);
    grid-template-columns: 1fr repeat(2, max-content);
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transform: translate(-50%, 0);
    background: var(--slate-2);
    box-shadow: 0 0.25rem 0.5rem var(--slate-9);
  }
  h2 {
    font-size: 1rem;
    line-height: 1.5;
  }
  .x-id {
    font-size: 1rem;
  }
  .identity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .memo {
    width: 100%;
  }
  .penalties {
    display: grid;
    min-width: 20rem;
    grid-template-columns: max-content 1fr;
    gap: 0.25rem 0.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid var(--slate-6);
    &-title {
      font-weight: bold;
    }
  }
  .penalty {
    padding: 0 0.5rem;
    border-radius: 0.25rem;
    &--warning {
      background: var(--yellow-9);
      color: var(--yellow-12);
    }
    &--banned {
      background: var(--red-9);
      color: var(--red-1);
    }
  }
</style>
