<script lang="ts">
  import { api } from "$lib/api/api.gen";
  import { josa2 } from "$lib/shared/util/josa";
  import Cocktail from "$lib/ui/cocktail/cocktail.svelte";
  import { sendError } from "$lib/ui/error/send-error";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import InventoryItemImage from "$lib/ui/inventory/inventory-item-image.svelte";

  let { data } = $props();

  let routeMap = $derived(new Map(data.routeData.map((x) => [x.key, x])));
  let s = $state<string>("entry");
  let route = $derived.by(() => {
    const m = routeMap.get(s);
    if (m == null) return null;
    return {
      ...m,
      visiteds: data.visiteds,
    };
  });
  let error = $state<string>();

  let gainedItem = $state<{ key: string, name: string } | null>();
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
              if (type === "탐색") {
                const r = res.data.result;
                gainedItem = r;
              }
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

{#if typeof gainedItem !== "undefined"}
  <Dialog onclose={() => gainedItem = undefined}>
    {#if gainedItem}
      <InventoryItemImage key={gainedItem.key} />
      <div>{josa2(gainedItem.name, "이", "가")} 나왔다!</div>
    {:else}
      ... 아무것도 찾지 못했다.
      다른 곳을 찾아보자.
    {/if}
    <button onclick={() => gainedItem = undefined}>닫기</button>
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
