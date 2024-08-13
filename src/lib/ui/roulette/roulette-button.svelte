<script lang="ts">
  interface Props {
    onclick?: () => void;
    text?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    pressed?: boolean;
  }
  let {
    onclick,
    text,
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    pressed,
  }: Props = $props();
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

<g transform="translate({x} {y})">
  <rect
    class="button_hole"
    x={(width + 3) * -0.5}
    y={(height + 3) * -0.5}
    width={width + 3}
    height={height + 3}
  />
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <g class="button" class:button--pressed={pressed} tabindex="0" {onclick}>
    <rect
      class="button_bg"
      x={width * -0.5}
      y={height * -0.5}
      {width}
      {height}
      rx="2"
    />
    {#if text}
      <text class="button_text" y="1">{text}</text>
    {/if}
  </g>
</g>

<style lang="scss">
  .button {
    outline: none;
    fill: var(--red-9);
    stroke: url(#roulette-button_outline);
    filter: drop-shadow(1px 1px 1px var(--sand-a7))
      drop-shadow(2px 2px 2px var(--sand-a7))
      drop-shadow(4px 4px 4px var(--sand-a7));
    transform: translate(-0.5px, -0.5px);
    transition:
      transform 0.2s ease-in-out,
      filter 0.2s ease-in-out;

    cursor: pointer;

    &:hover {
      fill: var(--red-10);
    }
    &:active,
    &--pressed {
      transform: translate(0, 0);
      filter: none;
      transition:
        transform 0.02s ease-in-out,
        filter 0.02s ease-in-out;
    }
    &_text {
      text-anchor: middle;
      dominant-baseline: middle;
      fill: var(--red-3);
      font-weight: 700;
      font-size: 8px;
      paint-order: stroke;
      stroke: none;
    }
    &_hole {
      stroke: url(#roulette-button_hole_inset);
    }
  }
</style>
