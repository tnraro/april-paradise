<script lang="ts">
  import { api } from "$lib/api/api.gen";
  import Cocktail from "$lib/ui/cocktail/cocktail.svelte";
  import { sendError } from "$lib/ui/error/send-error";
    import Dialog from "$lib/ui/floating/dialog.svelte";

  let { data } = $props();

  let routeMap = $derived(new Map(data.routeData.map((x) => [x.key, x])));
  let s = $state<string>("entry");
  let route = $derived(routeMap.get(s));
  $inspect(s, route);

  let error = $state<string>();
</script>

<main>
  <div class="_">
    {#if route}
      {#key route.key}
        <Cocktail
          {...route}
          onnext={(next) => (s = next)}
          ontrigger={async (type, key) => {
            const res = await api().events.cocktail.post({
              type: type as "탐색" | "조사",
              key,
            });
            if (!res.ok) {
              error = res.error.message;
              sendError(res.error.message);
            } else {

            }
          }}
        />
      {/key}
    {/if}
  </div>
</main>

{#if error}
  <Dialog onclose={() => error = undefined}>
    <div>{error}</div>
    <button onclick={() => error = undefined}>닫기</button>
  </Dialog>
{/if}

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
</style>
