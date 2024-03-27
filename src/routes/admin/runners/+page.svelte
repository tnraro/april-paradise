<script lang="ts">
  let { data } = $props();
</script>

<div class="_">
  <div class="_title">이름</div>
  <div class="_title">𝕏</div>
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
    <div class="number">{runner.chips}</div>
    <div class="number">{runner.tokens}</div>
    <div>{runner.isBanned}</div>
    <div>{runner.hasIdentity}</div>
  {/each}
</div>

<style lang="scss">
  @use "sass:math";
  ._ {
    display: grid;
    grid-template-columns: repeat(6, max-content);
    gap: 0.5rem 1rem;

    &title {
      font-weight: bold;
    }
  }
  .number {
    text-align: right;
  }
</style>
