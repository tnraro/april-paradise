<script lang="ts">
  import type { RouletteData } from "$lib/data/sheets/model";
  import { pick } from "$lib/shared/random/pick.js";
  import Item from "$lib/ui/item/item.svelte";
  import Roulette from "$lib/ui/roulette/roulette.svelte";

  const onroll = () => {
    if (resultKey === "_random") {
      result = pick(
        table.map((x) => ({
          item: x.key,
          probability: x.probability,
        })),
      ).item;
    } else {
      result = resultKey;
    }
  };
  const onreward = () => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    history.push(table.find((x) => x.key === result)!.result);
  };
  interface Props {
    table: RouletteData[];
  }
  let { table } = $props<Props>();

  let result = $state<string>();
  let resultKey = $state("_random");

  let history = $state<RouletteData["result"][]>([]);
</script>

<div class="__sim">
  <div>
    <h2>모의 체험</h2>
    <div>
      <label>
        결과 설정
        <select bind:value={resultKey}>
          <option value="_random">랜덤</option>
          {#each table as t (t.key)}
            {@const text =
              t.result.type === "item"
                ? t.result.id
                : `${t.result.type === "chips" ? "칩" : "토큰"} ${t.result.quantity}`}
            <option value={t.key}>{text}</option>
          {/each}
        </select>
      </label>
    </div>
  </div>
  <div></div>
  <div style="width: 20rem">
    <Roulette
      table={table.map((x) => ({
        key: x.key,
        item: x.result,
      }))}
      {onroll}
      {result}
      {onreward}
    />
  </div>
  <div>
    <h3>기록</h3>
    <div class="history_items">
      {#each history as item}
        <Item {item} />
      {/each}
    </div>
  </div>
</div>

<style>
  ._ {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: 0.25rem 0.5rem;
    align-items: center;
  }
  .__sim {
    display: grid;
    grid-template-columns: repeat(2, max-content);
  }
  .history_items {
    max-width: 20rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
  }
</style>
