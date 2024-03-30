<script lang="ts">
  import { portal } from "$lib/ui/actions/portal";
  import Variant from "$routes/stylebook/lib/variant.svelte";
  import { sbs } from "$routes/stylebook/setup";
  import { oninput, propsToControls, value } from "$routes/stylebook/utils";
  import { slide } from "svelte/transition";

  let { data } = $props();

  let Component = $state();
  let variant = $state(data.props);

  let isControlsOpen = $state(true);
  let controls = $derived(propsToControls(variant));

  $effect(() => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const sb = sbs.get(data.id)!;
    variant = data.props;
    Component = undefined;

    sb.mod().then(({ meta }) => {
      Component = meta.Component;
    });
  });
</script>

{#if Component}
  <header>
    <a href="/stylebook/{data.id}">{data.path}</a>
    <h1>{data.variant}</h1>
  </header>
  <Variant {Component} props={variant} />
{/if}

<div class="_" use:portal>
  {#if isControlsOpen}
    <div
      transition:slide={{
        axis: "x",
      }}
      class="__"
    >
      <button onclick={() => (isControlsOpen = false)}>닫기</button>
      <div class="___">
        <div class="controls">
          {#each controls as control}
            <div>
              <h3>{control.path.join(".")}</h3>
              {#if control.type === "string"}
                <input
                  value={value(variant, control.path)}
                  oninput={oninput(variant, control.path)}
                />
              {:else if control.type === "number"}
                <input
                  type="number"
                  value={value(variant, control.path)}
                  oninput={oninput(variant, control.path)}
                />
              {:else if control.type === "boolean"}
                <input
                  type="checkbox"
                  role="switch"
                  checked={value(variant, control.path)}
                  oninput={oninput(variant, control.path)}
                />
              {/if}
            </div>
          {/each}
        </div>
      </div>
      <pre class="props">{JSON.stringify(variant, undefined, 2)}</pre>
    </div>
  {:else}
    <button onclick={() => (isControlsOpen = true)}>열기</button>
  {/if}
</div>

<style>
  ._ {
    position: fixed;
    top: 0;
    right: 0;
  }
  .__ {
    width: 20rem;
    height: 100dvh;
    background: var(--slate-2);
    border-left: 1px solid var(--slate-6);
    box-shadow: var(--height-4);
    padding: 1rem;
    display: grid;
    grid-template-rows: max-content 1fr max-content;
  }
  .___ {
    overflow: auto;
  }
  .controls {
    display: grid;
    gap: 0.5rem;
    padding: 1rem;
  }
  .props {
    background: var(--slate-12);
    color: var(--slate-1);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow: auto;
  }
</style>
