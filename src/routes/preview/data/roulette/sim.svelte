<script lang="ts">
  import type { RouletteData } from "$lib/data/sheets/model";
  import { pick } from "$lib/shared/random/pick.js";
  import Item from "$lib/ui/item/item.svelte";
  import Roulette from "$lib/ui/roulette/roulette.svelte";

  const onroll = async () => {
    if (resultKey === "_random") {
      result = pick(table);
      return { result };
    }
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    result = table.find((x) => x.key === resultKey)!;
    return { result };
  };
  const onreward = () => {
    if (result) history.push(result.result);
  };
  interface Props {
    table: RouletteData[];
  }
  let { table }: Props = $props();

  let result = $state<RouletteData>();
  let resultKey = $state("_random");
  let tokens = $state(3);
  let chips = $state(0);

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
    <Roulette bind:tokens bind:chips {table} {onroll} {onreward} />
  </div>
  <div>
    <h3>자원</h3>
    <span>토큰 {tokens}</span>
    <span>칩 {chips}</span>
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
