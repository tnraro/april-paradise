<script lang="ts">
  import { goto } from "$app/navigation";
  import { env } from "$env/dynamic/public";
  import type { App } from "$lib/api/app";
  import Roulette from "$lib/ui/roulette.svelte";
  import { edenTreaty } from "@elysiajs/eden";
  import { onMount } from "svelte";

  const client = edenTreaty<App>(env.PUBLIC_BASE_URL);
  const updateMe = async () => {
    const { error, data } = await client.api.me.get();
    if (error) {
      goto("/");
    } else {
      name = data.name;
      chips = data.chips;
      tokens = data.tokens;
    }
  };

  const onclick = async () => {
    if (tokens <= 0) return;
    if (isRolling) {
      result = _data;
      updateMe();
      if (result!.type === "item") {
        const key = _data!.text;
        const map = new Map<string, number>(inventory);
        map.set(key, (inventory.get(key) ?? 0) + 1);
        inventory = map;
      }
      isRolling = false;
    } else {
      isRolling = true;
      result = undefined;
      const { error, data } = await client.api.roulette.post();
      if (error) {
        console.error(error);
      } else {
        _data = data;
      }
    }
  };

  type Result =
    | { type: "chip"; n: number; text: string }
    | { type: "losing"; text: string }
    | { type: "item"; item: string; text: string };

  let tokens = $state(0);
  let name = $state("");
  let chips = $state(0);
  let isRolling = $state(false);
  let table = $state.frozen<string[]>([]);
  let result = $state<Result>();
  let _data: Result | undefined = undefined;
  let inventory = $state.frozen<Map<string, number>>(new Map());

  let isDisabled = $derived(tokens <= 0);

  onMount(() => {
    updateMe();
    client.api.config.roulette.get().then(({ error, data }) => {
      if (error) {
      } else {
        table = data.map((x) => x.result);
      }
    });
  });
</script>

<h1>{name}</h1>
<div>
  토큰: <span class="text-amber-600">{tokens}</span>
  칩: <span class="text-sky-600">{chips}</span>
</div>
<button class="btn-primary w-28" {onclick} disabled={isDisabled}
  >{isRolling ? "멈춰!" : "룰렛 굴리기"}</button
>
<Roulette data={table} {isRolling} result={result?.text} />
<div>
  <h1 class="font-bold">결과</h1>
  {#if result?.type === "losing"}
    <div class="text-red-600">꽝</div>
  {:else if result?.type === "chip"}
    <div>칩: <span class="text-sky-600">{result.n}</span></div>
  {:else if result?.type === "item"}
    <div>아이템: <span class="text-emerald-600">{result.item}</span></div>
  {/if}
</div>
<div>
  <h1 class="font-bold">가방</h1>
  <div class="grid gap-1">
    {#each inventory as [item, count]}
      {#if count === 1}
        <span>{item}</span>
      {:else}
        <span>{item}×{count}</span>
      {/if}
    {/each}
  </div>
</div>
