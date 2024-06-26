<script lang="ts">
  import { type FishingData, FishingGrade } from "$lib/data/sheets/model";
  import { groupBy } from "$lib/shared/util/group-by";
  import { Tooltip } from "bits-ui";

  let { data } = $props();

  let groupByLure = $derived(groupBy(data.data, (fish) => fish.lure));
</script>

{#snippet tooltip(row: FishingData)}
  <div
    class="tooltip_title"
    class:name--grade-0={row.grade === FishingGrade.Common}
    class:name--grade-1={row.grade === FishingGrade.Uncommon}
    class:name--grade-2={row.grade === FishingGrade.Heroic}
    class:name--grade-3={row.grade === FishingGrade.Legendary}
    class:name--grade-4={row.grade === FishingGrade.Mythic}
  >
    <h1>
      {row.name}
    </h1>
    <div>
      {#if row.grade === FishingGrade.Common}
        보통
      {:else if row.grade === FishingGrade.Uncommon}
        고급
      {:else if row.grade === FishingGrade.Heroic}
        영웅
      {:else if row.grade === FishingGrade.Legendary}
        전설
      {:else if row.grade === FishingGrade.Mythic}
        신화
      {/if}
    </div>
  </div>
  <div>"{row.catchphrase ?? "잡았다"}"</div>
  <div>{row.description}</div>
  <div>"{row.lure}"로 낚을 수 있다. 확률 {row.probability * 100}%</div>
{/snippet}

<h1>{data.name}</h1>
<div class="_">
  {#each groupByLure as [lure, fishes]}
    <div>
      <h2>미끼: {lure}</h2>
      <div class="__">
        <div class="__title">키</div>
        <div class="__title">이름</div>
        <div class="__title">설명</div>
        <div class="__title">확률</div>
        {#each fishes as row (row.key)}
          <div class="__key" title={row.key}>{row.key}</div>
          <Tooltip.Root openDelay={0} disableHoverableContent={true}>
            <Tooltip.Trigger asChild let:builder>
              <button
                use:builder.action
                {...builder}
                class="name"
                class:name--grade-0={row.grade === FishingGrade.Common}
                class:name--grade-1={row.grade === FishingGrade.Uncommon}
                class:name--grade-2={row.grade === FishingGrade.Heroic}
                class:name--grade-3={row.grade === FishingGrade.Legendary}
                class:name--grade-4={row.grade === FishingGrade.Mythic}
              >
                {row.name}
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="bottom"
              align="center"
            >
              {@render tooltip(row)}
            </Tooltip.Content>
          </Tooltip.Root>
          <div class="catchphrase" title={row.catchphrase}>
            {row.catchphrase}
          </div>
          <div>{row.probability * 100}%</div>
        {/each}
      </div>
    </div>
  {/each}
</div>


<style lang="scss">
  ._ {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: 2rem;
  }
  .__ {
    display: grid;
    grid-template-columns: repeat(4, max-content);
    gap: 0.25rem 0.5rem;
    align-items: center;
  }
  .name {
    &--grade-0 {
      color: var(--slate-10);
    }
    &--grade-1 {
      color: var(--green-10);
    }
    &--grade-2 {
      color: var(--blue-10);
    }
    &--grade-3 {
      color: var(--purple-10);
    }
    &--grade-4 {
      color: var(--amber-10);
    }
  }
  .catchphrase {
    width: 6rem;
    text-overflow: ellipsis;
    overflow: hidden;
    text-wrap: nowrap;
    text-decoration: underline 1px dotted;
    cursor: help;
  }

  .tooltip {
    &_title {
      display: flex;
      align-items: end;
      gap: 1ch;
    }
  }
</style>
