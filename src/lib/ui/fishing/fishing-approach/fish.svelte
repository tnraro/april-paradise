<script lang="ts">
  import fishGrade0 from "$img/fishing/fish-grade-0-w128.png?enhanced&w=64";
  import fishGrade1 from "$img/fishing/fish-grade-1-w128.png?enhanced&w=64";
  import fishGrade2 from "$img/fishing/fish-grade-2-w128.png?enhanced&w=64";
  import fishGrade3 from "$img/fishing/fish-grade-3-w128.png?enhanced&w=64";
  import fishGrade4 from "$img/fishing/fish-grade-4-w128.png?enhanced&w=64";
  import { FishingGrade } from "$lib/data/sheets/model";

  const getFishImage = (grade: FishingGrade) => {
    const imp = ((grade) => {
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
    })(grade) as unknown as { img: { src: string } };
    return imp.img.src;
  };

  interface Props {
    grade: FishingGrade;
    x?: number;
    y?: number;
    r?: number;
    onbite?: () => void;
  }
  let { grade, x = 0, y = 0, r = 0, onbite }: Props = $props();
  let w = $derived(16 + grade * 5);

  let _r = $derived.by(() => {
    switch (grade) {
      case FishingGrade.Common:
        return r + 15;
      case FishingGrade.Uncommon:
        return r + 20;
      case FishingGrade.Heroic:
        return r + 18;
      case FishingGrade.Legendary:
        return r + 23;
      case FishingGrade.Mythic:
    }
    return r;
  });
</script>

<g
  class="move"
  onanimationend={onbite}
  transform="translate({x} {y}) rotate({_r})"
>
  <image
    href={getFishImage(grade)}
    width={w}
    height={w}
    x={-w * 0.5}
    y={-w * 0.5}
  />
</g>

<style>
  .move {
    offset-path: path("M50 40C28 40 25 30 5 20");
    offset-rotate: reverse;
    animation: move 1s ease-out forwards;
  }
  @keyframes -global-move {
    0% {
      offset-distance: 0%;
    }
    100% {
      offset-distance: 100%;
    }
  }
</style>
