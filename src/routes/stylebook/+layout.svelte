<script lang="ts">
  let { data, children } = $props();
</script>

<div class="_">
  <header>
    <a href="/stylebook">스타일북</a>
  </header>
  
  <div class="__">
    <div class="side-view">
      목록
      <ul>
        {#each data.sbs as sb}
          <li>
            <details>
              <summary>
                <a href="/stylebook/{sb.id}">{sb.path}</a>
              </summary>
              <ul>
                {#each sb.variants as variant}
                  <li><a href="/stylebook/{sb.id}/v/{variant}">{variant}</a></li>
                {/each}
              </ul>
            </details>
          </li>
        {/each}
      </ul>
    </div>
    
    <div class="main-view">
      <main>
        {@render children()}
      </main>
    </div>
  </div>
</div>

<style>
  ._ {
    display: grid;
    grid-template-rows: max-content 1fr;
    height: 100%;
  }
  header {
    border-bottom: 1px solid var(--slate-6);
  }
  .__ {
    display: grid;
    grid-template-columns: max-content 1fr;
    overflow: hidden;
  }
  .side-view {
    padding: 0 0.5rem;
    border-right: 1px solid var(--slate-6);
    height: 100%;
    overflow-y: auto;
  }
  .main-view {
    overflow-y: auto;
  }
  main {
    display: grid;
    gap: 2rem;
    padding: 0 2rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  ul ul > li {
    padding-left: 2rem;
  }
</style>