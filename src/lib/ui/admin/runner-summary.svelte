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

<div>
  <span>{name}</span>
  <span>@{twitterId}</span>
  <span>
    {#if isBanned}
      <span>제명됨</span>
    {/if}
  </span>
  <span>{chips}</span>
  <span>{tokens}</span>
</div>
