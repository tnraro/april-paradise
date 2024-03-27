<script lang="ts">
    import { invalidate } from '$app/navigation';
  import { api } from '$lib/api/api.gen.js';
    import { sendError } from '$lib/ui/error/send-error.js';

  const syncRunner = async () => {
    const res = await api().runners.put(undefined);
    if (!res.ok) {
      sendError("sync failed", res.error);
    } else {
      if (res.data.updated > 0) {
        invalidate("admin:runners");
      }
    }
  }
  let { data, children } = $props();
</script>

<div class="_">
  <div class="_left">
    <button onclick={syncRunner}>러너 동기화</button>
    <div role="tablist" class="tablist">
      <a
        role="tab"
        class="tab"
        aria-selected={data.selected == null}
        aria-controls="panel"
        href="/admin/runners"
      >
        전체 보기
      </a>
      {#each data.runners as runner (runner.id)}
        <a
          role="tab"
          class="tab"
          aria-selected={runner.selected}
          aria-controls="panel"
          href="/admin/runners/{runner.key}">{runner.name}</a
        >
      {/each}
    </div>
  </div>
  <div id="panel" role="tabpanel" class="tabpanel">
    {#key data.selected}
      {@render children()}
    {/key}
  </div>
</div>

<style lang="scss">
  ._ {
    display: grid;
    grid-template-columns: max-content 1fr;
    height: calc(100dvh - 2.5rem /* hard coded header height */);
  }
  ._left {
    display: grid;
    align-content: start;
    gap: 0.5rem;
    overflow: hidden scroll;
    background: var(--slate-2);
    padding: 0.25rem 0.5rem;
  }
  .tablist {
    display: grid;
    align-content: start;
  }
  .tab {
    text-decoration: none;
    padding: 0.25rem 0.5rem;

    &[aria-selected="true"] {
      background: var(--slate-4);
    }
  }
  .tabpanel {
    overflow: hidden scroll;
  }
</style>
