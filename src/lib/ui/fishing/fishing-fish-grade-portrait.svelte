<script lang="ts">
  import fishGrade0 from "$img/fishing/fish-grade-0-w128.png?enhanced&w=64";
  import fishGrade1 from "$img/fishing/fish-grade-1-w128.png?enhanced&w=64";
  import fishGrade2 from "$img/fishing/fish-grade-2-w128.png?enhanced&w=64";
  import fishGrade3 from "$img/fishing/fish-grade-3-w128.png?enhanced&w=64";
  import fishGrade4 from "$img/fishing/fish-grade-4-w128.png?enhanced&w=64";
  import { type FishingData, FishingGrade } from "$lib/data/sheets/model";

  const getFishImage = (grade: FishingGrade = FishingGrade.Common) => {
    return ((grade) => {
      switch (grade) {
        case FishingGrade.Common:
          return fishGrade0;
        case FishingGrade.Uncommon:
          return fishGrade1;
        case FishingGrade.Heroic:
          return fishGrade2;
        case FishingGrade.Legendary:
          return fishGrade3;
        case FishingGrade.Mythic:
          return fishGrade4;
      }
      return fishGrade0;
    })(grade);
  };

  interface Props {
    fish: Pick<FishingData, "grade">;
  }
  let { fish }: Props = $props();
</script>

<enhanced:img alt="" src={getFishImage(fish.grade)} />

<style>
</style>
