<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { api } from "$lib/api/api.gen";
  import { josa2 } from "$lib/shared/util/josa";
    import CocktailNpc from "$lib/ui/cocktail/cocktail-npc.svelte";
  import Cocktail from "$lib/ui/cocktail/cocktail.svelte";
  import { sendError } from "$lib/ui/error/send-error";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import InventoryItemImage from "$lib/ui/inventory/inventory-item-image.svelte";
    import AnimatingText from "$lib/ui/text/animating-text.svelte";

  const close탐색 = () => {
    gainedItem = undefined;
    invalidateAll();
  }
  const close조사 = () => {
    조사 = undefined;
    invalidateAll();
  }
  const closeError = () => {
    error = undefined;
    invalidateAll();
  }

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
  let 조사 = $state<string>();

  let done = $derived.by(() => {
    if (data.visiteds.length === 0) return false;
    const N = data.visiteds[0].type === "탐색" ? 5 : 3;
    return data.visiteds.length >= N;
  });
</script>

<main>
  {#if done}
    {data.visiteds[0].type} 기회를 모두 소진했습니다!
  {:else}
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
                } else if (type === "조사") {
                  조사 = key;
                }
              }
            }}
          />
        {/key}
      {/if}
    </div>
  {/if}
</main>

{#if error}
  <Dialog onclose={closeError}>
    <div class="__">
      <div>{error}</div>
      <button onclick={closeError}>닫기</button>
    </div>
  </Dialog>
{/if}

{#if typeof gainedItem !== "undefined"}
  <Dialog onclose={close탐색}>
    <div class="__">
      {#if gainedItem}
        <InventoryItemImage key={gainedItem.key} />
        <div>{josa2(gainedItem.name, "이", "가")} 나왔다!</div>
      {:else}
        ... 아무것도 찾지 못했다.
        다른 곳을 찾아보자.
      {/if}
      <button onclick={close탐색}>닫기</button>
    </div>
  </Dialog>
{/if}

{#if 조사}
  {@const m = routeMap.get(조사)}
  {#if m}
    <Dialog onclose={close조사}>
      <div class="__">
        <CocktailNpc npc={m.npc} script={m.script} onclick={close조사} />
      </div>
    </Dialog>
  {/if}
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
  .__ {
    display: grid;
    gap: 0.5rem;
  }
</style>
