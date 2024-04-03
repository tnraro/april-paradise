<script lang="ts">
  import type { FishingGrade } from "$lib/data/sheets/model";
  import { onDestroy, onMount } from "svelte";
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

{#if s === FishingState.Waiting || s === FishingState.Approaching || s === FishingState.Biting}
  <div
    class="_"
    class:_--is-waiting={s === FishingState.Waiting}
    class:_--is-approaching={s === FishingState.Approaching}
    class:_--is-biting={s === FishingState.Biting}
  >
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
{/if}

<style lang="scss">
  ._ {
    border: 0.5rem solid var(--slate-6);
    width: 12rem;
    height: 12rem;
    border-radius: 99999rem;
    overflow: hidden;
    &--is-biting {
      animation: endurance 3s ease-out forwards;
    }
    animation: scale 400ms cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }
  .__ {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 99999rem;
    z-index: 1;
  }
  @keyframes -global-endurance {
    0% {
      border-color: var(--slate-6);
    }
    100% {
      border-color: var(--red-6);
    }
  }
  @keyframes -global-scale {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
