<script lang="ts">
  import PenaltyDialog from "$lib/ui/admin/penalty-dialog.svelte";

  let { data } = $props();

  let current = $state(data.runners.at(0));
  let showPenaltyDialog = $state(false);
</script>

<div class="_">
  <div class="_title">이름</div>
  <div class="_title">𝕏</div>
  <div class="_title">메모</div>
  <div class="_title">칩</div>
  <div class="_title">토큰</div>
  <div class="_title">경고</div>
  <div class="_title">계정</div>
  {#each data.runners as runner (runner.id)}
    <div>{runner.name}</div>
    <a
      class="x-id"
      href="https://twitter.com/{runner.twitterId}"
      target="_blank"
      rel="noreferrer"
      title="@{runner.twitterId}">𝕏</a
    >
    <div>{runner.memo}</div>
    <div class="number">{runner.chips}</div>
    <div class="number">{runner.tokens}</div>
    <button
      class="penalties"
      onclick={() => {
        current = runner;
        showPenaltyDialog = true;
      }}
    >
      {#each { length: runner.banneds } as _, i}
        <div class="penalty-card penalty-card--banned"></div>
      {/each}
      {#each { length: runner.warnings } as _, i}
        <div class="penalty-card penalty-card--warning"></div>
      {/each}
    </button>
    <div>{runner.hasIdentity}</div>
  {/each}
</div>

{#if current != null}
  {#if showPenaltyDialog}
    <PenaltyDialog
      id={current.id}
      name={current.name}
      onclose={() => (showPenaltyDialog = false)}
    />
  {/if}
{/if}

<style lang="scss">
  @use "sass:math";
  ._ {
    display: grid;
    grid-template-columns: repeat(7, max-content);
    gap: 0.5rem 1rem;

    &title {
      font-weight: bold;
    }
  }
  .penalties {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    ---bg: none;
    &:hover .penalty-card {
      transform: translate(0, 0) rotate(0deg);
    }
    &:focus-visible .penalty-card {
      transform: translate(0, 0) rotate(0deg);
    }
  }
  .penalty-card {
    width: 0.75rem;
    aspect-ratio: 25/35;
    background: var(---bg);
    border-radius: 0.1rem;
    transition: transform cubic-bezier(1, 0, 0, 1) 0.2s;

    &--warning {
      ---bg: var(--yellow-9);
    }
    &--banned {
      ---bg: var(--red-9);
    }

    @for $i from 1 through 4 {
      &:nth-child(#{$i}) {
        transition-delay: #{math.log($i, 4) * 100}ms;
        transform: translate(-#{($i - 1) * 0.5}rem, 0) rotate(20deg);
        z-index: #{4 - $i};
      }
    }
  }
  .number {
    text-align: right;
  }
</style>
