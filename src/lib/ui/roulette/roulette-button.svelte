<script lang="ts">
  import { RouletteState } from "./roulette";

  interface Props {
    onclick?: () => void;
    _state: RouletteState;
  }
  let { onclick, _state } = $props<Props>();
</script>

<defs>
  <linearGradient id="roulette-button_outline" gradientTransform="rotate(45)">
    <stop offset="50%" stop-color="var(--red-7)"></stop>
    <stop offset="90%" stop-color="var(--red-10)"></stop>
  </linearGradient>
  <linearGradient
    id="roulette-button_hole_inset"
    gradientTransform="rotate(45)"
  >
    <stop offset="50%" stop-color="var(--sand-6)"></stop>
    <stop offset="90%" stop-color="var(--sand-2)"></stop>
  </linearGradient>
</defs>

<rect class="button_hole" x="-41.5" y="87.5" width="83" height="33" />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<g class="button" tabindex="0" {onclick}>
  <rect class="button_bg" x="-40" y="89" width="80" height="30" rx="2" />
  <text class="button_text" y="105">
    {#if _state === RouletteState.Idle}
      토큰을 넣으세요
    {:else if _state === RouletteState.InsertingToken}
      토큰을 넣으세요
    {:else if _state === RouletteState.Rolling}
      멈추기
    {:else if _state === RouletteState.DroppingReward}
      보상 받기
    {/if}
  </text>
</g>

<style lang="scss">
  .button {
    outline: none;
    fill: var(--red-9);
    stroke: url(#roulette-button_outline);
    filter: drop-shadow(1px 1px 1px hsla(0deg 0% 0% / 0.2))
      drop-shadow(2px 2px 2px hsla(0deg 0% 0% / 0.2))
      drop-shadow(4px 4px 4px hsla(0deg 0% 0% / 0.2));
    transform: translate(-0.5px, -0.5px);
    transition:
      transform 0.2s ease-in-out,
      filter 0.2s ease-in-out;

    cursor: pointer;

    &:hover {
      fill: var(--red-10);
    }
    &:active {
      transform: translate(0, 0);
      filter: none;
      transition:
        transform 0.02s ease-in-out,
        filter 0.02s ease-in-out;
    }
    &_text {
      font-family: var(--font-serif);
      text-anchor: middle;
      dominant-baseline: middle;
      fill: var(--sand-12);
      font-weight: 700;
      font-size: 9px;
      paint-order: stroke;
      stroke: var(--red-1);
      stroke-width: 2px;
    }
    &_hole {
      stroke: url(#roulette-button_hole_inset);
    }
  }
</style>
