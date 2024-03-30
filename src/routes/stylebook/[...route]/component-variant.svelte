<script lang="ts">
  import { type ComponentType, mount } from "svelte";
  import { oninput, propsToControls, value } from "../utils";

  interface Props {
    name: string;
    Component: ComponentType;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    props: any;
  }
  let { name, Component, props }: Props = $props();
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  let self = $state<Element>(undefined!);
  let controls = $derived(propsToControls(props));

  $inspect(props, controls);

  $effect(() => {
    self.innerHTML = "";
    mount(Component, {
      target: self,
      props,
    });
  });
</script>

<div>
  <h3>{name}</h3>
  <div class="_">
    <div bind:this={self} />
  </div>
  <details>
    <summary>props</summary>
    <pre class="props">{JSON.stringify(props, undefined, 2)}</pre>
  </details>
  <details>
    <summary>controls</summary>
    {#each controls as control}
      <h4>{control.path}</h4>
      {#if control.type === "string"}
        <input
          value={value(props, control.path)}
          oninput={oninput(props, control.path)}
        />
      {:else if control.type === "number"}
        <input
          type="number"
          value={value(props, control.path)}
          oninput={oninput(props, control.path)}
        />
      {:else if control.type === "boolean"}
        <input
          type="checkbox"
          role="switch"
          checked={value(props, control.path)}
          oninput={oninput(props, control.path)}
        />
      {/if}
    {/each}
  </details>
</div>

<style>
  ._ {
    border: 1px solid var(--slate-6);
    border-radius: 0.25rem;
    width: fit-content;
    max-width: 100%;
    padding: 1rem;
    overflow-x: auto;
  }
  .props {
    background: var(--slate-2);
    border-radius: 0.25rem;
    padding: 1rem;
    width: fit-content;
    max-width: 100%;
    overflow-x: auto;
  }
</style>
