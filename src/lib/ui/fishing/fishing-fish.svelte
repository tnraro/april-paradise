<script lang="ts">
  import { type FishingData, FishingGrade } from "$lib/data/sheets/model";
  import { josa } from "$lib/shared/util/josa";

  interface Props {
    fish: FishingData;
  }
  let { fish } = $props<Props>();
</script>

<div>
  <span
    class="fish"
    class:fish--grade-0={fish.grade === FishingGrade.Common}
    class:fish--grade-1={fish.grade === FishingGrade.Uncommon}
    class:fish--grade-2={fish.grade === FishingGrade.Heroic}
    class:fish--grade-3={fish.grade === FishingGrade.Legendary}
    class:fish--grade-4={fish.grade === FishingGrade.Mythic}
  >
    {fish.name}
  </span>{josa(fish.name, "을", "를")} 낚았다!
</div>
<div class="catchphrase">
  {fish.catchphrase ?? fish.description}
</div>

<style lang="scss">
  .fish {
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
    border: 1px solid var(--slate-6);
    padding: 1rem;
    border-radius: 0.25rem;
    width: 20rem;
    word-break: keep-all;
  }
</style>
