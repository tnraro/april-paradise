<script lang="ts">
  import { FishingGrade } from "$lib/data/sheets/model";
  import InventoryItem from "$lib/ui/inventory/inventory-item.svelte";

  let { data } = $props();
</script>

<div class="inventory">
  {#each data.data as item}
    <InventoryItem {...item} quantity={1}>
      <div class="grid">
        <div class="title">이름</div>
        <div>{item.name}</div>
        <div class="title">등급</div>
        <div>
          {#if item.grade === FishingGrade.Common}
            일반
          {:else if item.grade === FishingGrade.Uncommon}
            고급
          {:else if item.grade === FishingGrade.Heroic}
            영웅
          {:else if item.grade === FishingGrade.Legendary}
            전설
          {:else if item.grade === FishingGrade.Mythic}
            신화
          {/if}
        </div>
        <div class="title">미끼</div>
        <div>{item.lure}</div>
        <div class="title">설명</div>
        <div>{item.description}</div>
        <div class="title">확률</div>
        <div>{(item.probability * 100).toFixed(2)}%</div>
        <div class="title">체력</div>
        <div>{item.hp}초</div>
        <div class="title">힘</div>
        <div>{item.power}</div>
        <div class="title">사나운 정도</div>
        <div>{item.rampancy}</div>
        <div class="title">인내심</div>
        <div>{item.endurance}초</div>
      </div>
    </InventoryItem>
  {/each}
</div>

<style lang="scss">
  .inventory {
    display: grid;
    grid-template-columns: repeat(auto-fill, 64px);
    gap: 1rem;
    justify-content: center;
    margin-bottom: 4rem;
  }
  .grid {
    display: grid;
    grid-template-columns: max-content auto;
  }
  .title {
    font-weight: 700;
    margin-right: 1ch;
  }
</style>
