<script lang="ts">
  import { api } from '$lib/api/api.gen.js';
  import { sendError } from '$lib/ui/error/send-error';
  import Dialog from '$lib/ui/floating/dialog.svelte';

  let { children, data } = $props();

  let isLoading = $state(false);
  let error = $state<string>();
</script>

<nav>
  <a class="text" href="{data.sheetsUrl}" target="_blank" rel="noreferrer">구글 시트</a>
  
  {#each data.index as index}
    <a href="/admin/static-data/{index.key}">{index.name}</a>
  {/each}
</nav>
<button onclick={async () => {
  isLoading = true;
  const res = await api().data.put(undefined);
  isLoading = false;
  if (!res.ok) {
    error = res.error.message;
    sendError(res.error.message);
  }
}} disabled={isLoading}>데이터 동기화</button>

{@render children()}

{#if error}
  <Dialog onclose={() => error = undefined}>
    {error}
  </Dialog>
{/if}

<style>
  .text {
    display: flex;
    align-items: center;
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>