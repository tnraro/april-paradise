<script lang="ts">
  interface Props {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    Component: any;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    props: any;
  }
  let { Component, props }: Props = $props();
</script>

<div class="_">
  <Component {...props} />
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
