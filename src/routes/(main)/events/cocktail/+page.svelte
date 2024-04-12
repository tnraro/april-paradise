<script lang="ts">
  import Cocktail from "$lib/ui/cocktail/cocktail.svelte";

  let { data } = $props();

  let routeMap = $derived(new Map(data.routeData.map((x) => [x.key, x])));
  let s = $state<string>("entry");
  let route = $derived(routeMap.get(s));
</script>

<main>
  <div class="_">
    {#if route}
      {#key route.key}
        <Cocktail
          {...route}
          onnext={(next) => (s = next)}
          ontrigger={(x, y) => console.log(x, y)}
        />
      {/key}
    {/if}
  </div>
</main>

<style>
  main {
    display: grid;
    place-items: center;
    width: min(20rem, 100vw);
    margin: 0 auto;
    height: 100%;
  }
  ._ {
    height: 100%;
    max-height: 30rem;
  }
  @media (orientation: portrait) {
    ._ {
      max-height: 100%;
      padding: 1rem 0;
    }
  }
</style>
