<script lang="ts">
  import { type ComponentType } from "svelte";
  import { sbs } from "../stylebook.setup";
  import ComponentVariant from "./component-variant.svelte";

  let { data } = $props();

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  let Component = $state<ComponentType>(undefined!);
  let variants = $state<{ name: string; props: unknown }[]>([]);

  $effect(() => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const sb = sbs.get(`/${data.path}`)!;
    sb.mod().then((sb) => {
      Component = sb.meta.Component;
      variants = Object.entries(sb.meta.variants).map(([name, props]) => {
        return {
          name,
          props,
        };
      });
    });
  });
</script>

<article>
  <h1>{data.path}</h1>

  <section>
    <h2>변종</h2>
    {#each variants as variant}
      <ComponentVariant {...variant} {Component} />
    {/each}
  </section>
</article>

<style>
  article {
    display: grid;
    gap: 2rem;
    padding: 0 2rem;
  }
  section {
    display: grid;
    gap: 1rem;
  }
</style>