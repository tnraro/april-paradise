<script lang="ts">
  import NewRunner from "$lib/ui/admin/new-runner.svelte";
  import RunnerSummary from "$lib/ui/admin/runner-summary.svelte";

  let { data } = $props();

  let isOpenNewRunner = $state(false);
</script>

<div>
  {#if isOpenNewRunner}
    <button onclick={() => (isOpenNewRunner = false)}>닫기</button>
  {:else}
    <button onclick={() => (isOpenNewRunner = true)}>새 러너 추가</button>
  {/if}
</div>
<div>
  {#if isOpenNewRunner}
    <NewRunner onclose={() => (isOpenNewRunner = false)} />
  {/if}
  {#each data.runners as runner (runner.id)}
    <RunnerSummary {...runner} />
  {/each}
</div>
