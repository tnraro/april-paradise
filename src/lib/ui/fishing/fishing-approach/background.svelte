<script lang="ts">
  import type { FishingGrade } from "$lib/data/sheets/model";
  import { FishingState } from "../fishing-state.svelte";
  import Cloud from "./cloud.svelte";
  import Fish from "./fish.svelte";
  import FishingLine from "./fishing-line.svelte";
  import Wave from "./wave.svelte";

  interface Props {
    s: FishingState;
    t: number;
    grade: FishingGrade;
    y: number;
    onbite?: () => void;
  }
  let { s, t, grade, y, onbite }: Props = $props();

  let speed = $derived(10 + grade * 10);
  let wavelength = $derived(80 - grade * 6);
  let amplitude = $derived(5 + grade * 0.5);

  let float = $derived.by(() => {
    switch (s) {
      case FishingState.Biting: {
        const deg = 2;
        const r = (deg / 180) * Math.PI;
        const m = Math.sin(t / 18) + Math.cos(t / 53) + grade * 2;
        const x = Math.cos(r) * m;
        const y = Math.sin(r) * m + 5;
        return {
          x: x - 2,
          y: y + 15,
        };
      }
    }
    return {
      x: -5,
      y: 5 + Math.sin(((10 / 18) * Math.PI * t + 24) / 1000) * 5,
    };
  });

  let fish = $derived.by(() => {
    switch (s) {
      case FishingState.Waiting:
      case FishingState.Approaching:
        return { x: 0, y: 0, r: 0 };
      case FishingState.Biting: {
        const deg = 2;
        const r = (deg / 180) * Math.PI;
        const m = Math.sin(t / 18) + Math.cos(t / 53) + grade * 2;
        const x = Math.cos(r) * m;
        const y = Math.sin(r) * m + 5;
        return {
          x,
          y,
          r: deg,
        };
      }
    }
  });
</script>

<svg viewBox="-50 -50 100 100">
  <Cloud />
  <g transform="translate(0, {10 + y})">
    <g transform="translate(0, -10)">
      <Wave
        amplitude={amplitude - 2}
        {wavelength}
        {t}
        offsetX={0.0375 * wavelength}
        speed={speed - 1}
      />
    </g>
    <g transform="translate(0, -5)">
      <Wave
        amplitude={amplitude - 1}
        {wavelength}
        {t}
        offsetX={0.8375 * wavelength}
        speed={speed - 1}
      />
    </g>
    <FishingLine {...float} {s} />
    {#if s === FishingState.Approaching || s === FishingState.Biting}
      <Fish {grade} {onbite} {...fish} />
    {/if}
    <g transform="translate(0, 5)">
      <Wave {amplitude} {wavelength} {t} offsetX={0.3 * wavelength} {speed} />
    </g>
    <g transform="translate(0, 20)">
      <Wave
        {amplitude}
        {wavelength}
        {t}
        offsetX={0.9375 * wavelength}
        {speed}
      />
    </g>
  </g>
</svg>

<style>
  svg {
    background: #e0f6f9;
  }
</style>
