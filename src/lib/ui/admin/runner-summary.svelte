<script lang="ts">
  interface Props {
    id: string;
    name: string;
    twitterId: string;
    isBanned: boolean;
    chips: number;
    tokens: number;
  }
  let { id, name, twitterId, isBanned, chips, tokens } = $props<Props>();
</script>

<div class="runner-summary">
  <span>{name}</span>
  <a class="x-id" href="https://twitter.com/{twitterId}" rel="noreferrer" target="_blank"
    >@{twitterId}</a
  >
  <span>
    {#if isBanned}
      <span>제명됨</span>
    {/if}
  </span>
  <span>{chips}</span>
  <span>{tokens}</span>
</div>

<style>
  .runner-summary {
    display: grid;
    grid-template-columns: repeat(5, max-content);
    gap: 0.5rem;
  }
  .x-id {
    color: var(--slate-11);
  }
</style>
