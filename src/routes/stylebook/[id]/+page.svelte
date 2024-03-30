<script lang="ts">
  import Variant from "../lib/variant.svelte";
  import { sbs } from "../setup";

  let { data } = $props();
  let Component = $state();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let variants = $state<[string, any][]>([]);

  $effect(() => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const sb = sbs.get(data.id)!;

    sb.mod().then(({ meta }) => {
      Component = meta.Component;
      variants = [...Object.entries(meta.variants)];
    });
  });
</script>

<h1>{data.id}</h1>

<section>
  <h2>변종</h2>

  {#each variants as [name, props]}
    <h3><a href="/stylebook/{data.id}/v/{name}">{name}</a></h3>
    <Variant {Component} {props} />
  {/each}
</section>

<style>
  section {
    display: grid;
    gap: 1rem;
  }
</style>
