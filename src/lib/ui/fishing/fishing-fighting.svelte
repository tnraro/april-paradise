<script lang="ts">
  import FishingFishGradePortrait from "./fishing-fish-grade-portrait.svelte";
  import type { CaughtFish } from "./fishing-state.svelte";
  interface Props {
    fish: Pick<CaughtFish, "grade">;
    hpRatio: number;
    enRatio: number;
    powerRatio: number;
  }
  let { fish, hpRatio, enRatio, powerRatio }: Props = $props();
</script>

<div class="_">
  <div class="_fish">
    <FishingFishGradePortrait {fish} />
    <div class="range">
      <div
        class="range__bar range__bar--hp"
        style="width:{hpRatio * 100}%"
      ></div>
      <div
        class="range__bar range__bar--en"
        style="width:{enRatio * 100}%"
      ></div>
    </div>
  </div>
  <div class="_rod">
    <enhanced:img class="fish pixel" src="$img/rod.png?w=64" />
    <div class="range">
      <div
        class="range__bar range__bar--power"
        style="width:{powerRatio * 100}%"
      ></div>
    </div>
  </div>
</div>

<style lang="scss">
  ._ {
    display: grid;
    &fish {
      display: grid;
      justify-items: end;
    }
    &rod {
      display: grid;
      justify-items: start;
    }
  }
  .range {
    position: relative;
    background: var(--slate-3);
    width: 20rem;
    height: 1rem;
    &__bar {
      position: absolute;
      top: 0;
      left: 0;
      &--hp {
        background: var(--red-9);
        height: 100%;
      }
      &--en {
        background: var(--yellow-9);
        height: 50%;
      }
      &--power {
        background: var(--green-9);
        height: 100%;
      }
    }
  }
</style>
