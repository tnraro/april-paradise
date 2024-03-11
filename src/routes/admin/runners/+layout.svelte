<script lang="ts">
  let { data, children } = $props();
</script>

<div class="_">
  <div class="_left">
    <button>+ 러너 추가</button>
    <div role="tablist" class="tablist">
      {#each data.runners as runner (runner.id)}
        <a
          role="tab"
          class="tab"
          aria-selected={runner.selected}
          aria-controls="panel"
          href="/admin/runners/{runner.name}">{runner.name}</a
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
