<script lang="ts">
  import { pick } from "$lib/shared/random/pick.js";
  import Item from "$lib/ui/item/item.svelte";
  import Roulette from "$lib/ui/roulette/roulette.svelte";

  const onroll = () => {
    result = pick(
      data.data.map((x) => ({
        item: x.key,
        probability: x.probability,
      })),
    ).item;
  };
  let { data } = $props();

  let result = $state<string>();
</script>

<h1>{data.name}</h1>
<div class="_">
  <div class="__title">키</div>
  <div class="__title">결과</div>
  <div class="__title">확률</div>
  {#each data.data as row (row.key)}
    <div class="__key" title={row.key}>{row.key}</div>
    <Item item={row.result} />
    <div>{row.probability * 100}%</div>
  {/each}
</div>

<div style="width: 20rem">
  <Roulette
    table={data.data.map((x) => ({
      key: x.key,
      item: x.result,
    }))}
    {onroll}
    bind:result
  />
</div>

<style>
  ._ {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: 0.25rem 0.5rem;
    align-items: center;
  }
</style>
