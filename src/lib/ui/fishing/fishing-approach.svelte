<script lang="ts">
  import type { FishingGrade } from "$lib/data/sheets/model";
  import { onDestroy, onMount } from "svelte";
  import { backOut } from "svelte/easing";
  import { scale } from "svelte/transition";
  import Background from "./fishing-approach/background.svelte";
  import { FishingState } from "./fishing-state.svelte";

  interface Props {
    s: FishingState;
    grade: FishingGrade;
    onbite?: () => void;
  }
  let { s, grade, onbite }: Props = $props();

  let x = $state(0);
  let y = $state(0);
  let r = $state(0);

  let isRunning: boolean;

  let time = $state(0);

  const render = (t: number) => {
    if (!isRunning) return;

    y = Math.sin(t * 0.001) * 10;
    r = Math.sin(t * 0.0004) * 4;

    time = t;

    requestAnimationFrame(render);
  };

  onMount(() => {
    isRunning = true;
    requestAnimationFrame(render);
  });
  onDestroy(() => {
    isRunning = false;
  });
</script>

<div class="_" class:_--is-bite={s === FishingState.Biting} in:scale={{ easing: backOut }}>
  <Background
    {s}
    t={time}
    {grade}
    y={0}
    onbite={() => {
      onbite?.();
    }}
  />
</div>

<style lang="scss">
  ._ {
    border: 8px solid var(--slate-6);
    width: 12rem;
    height: 12rem;
    border-radius: 99999rem;
    overflow: hidden;
    &--is-bite {
      animation: endurance 3s linear forwards;
    }
  }
  @keyframes -global-endurance {
    0% {
      border-color: var(--slate-6);
    }
    100% {
      border-color: var(--red-6);
    }
  }
</style>
