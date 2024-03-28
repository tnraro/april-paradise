<script lang="ts">
  interface Props {
    text?: string;
  }
  let { text }: Props = $props();
</script>

<defs>
  <linearGradient id="roulette-lcd_inset" gradientTransform="rotate(45)">
    <stop offset="50%" stop-color="var(--sand-7)"></stop>
    <stop offset="90%" stop-color="var(--sand-4)"></stop>
  </linearGradient>
  <radialGradient id="roulette-lcd_vignetting" r="80%">
    <stop offset="0.5" stop-opacity="0"></stop>
    <stop offset="1"></stop>
  </radialGradient>
  <pattern id="roulette-lcd_pattern" viewBox="0 0 2 2" width="4%" height="4%">
    <rect width="2" height="2" fill="hsl(53deg 5% 50%)" />
    <rect width="2" height="1" fill="hsl(0deg 15% 70%)" />
  </pattern>
  <rect
    id="roulette-lcd_pattern-rect"
    width="100%"
    height="100%"
    fill="url(#roulette-lcd_pattern)"
  ></rect>
  <rect
    id="roulette-lcd_vignette-rect"
    width="100%"
    height="100%"
    fill="url(#roulette-lcd_vignetting)"
  ></rect>
  <filter id="roulette-lcd_filter">
    <feImage href="#roulette-lcd_pattern-rect" result="pattern" />
    <feBlend in="SourceGraphic" in2="pattern" mode="overlay" result="out1" />
    <feImage href="#roulette-lcd_vignette-rect" result="vignette" />
    <feBlend in="out1" in2="vignette" mode="multiply" result="out2" />
    <feComposite in2="SourceAlpha" operator="atop" />
    <feColorMatrix
      values="
      0.5 0.2 0.1 0 0
      0.1 0.7 0.2 0 0
      0 0.1 0.5 0 0
      0 0 0 1 0"
    />
  </filter>
  <filter id="roulette-lcd_text-filter">
    <feGaussianBlur stdDeviation="1" />
    <feBlend in="SourceGraphic" />
  </filter>
  <clipPath id="roulette-lcd_text-clip">
    <rect class="lcd_text-clip-rect" x="-40" y="-16" width="80" height="32" />
  </clipPath>
</defs>

<g transform="translate(0 105)">
  <g filter="url(#roulette-lcd_filter)">
    <rect class="lcd" x="-40" y="-12" width="80" height="24" rx="2" />
    {#if text}
      <text y="1" class="lcd_text">{text}</text>
    {/if}
  </g>
  <rect class="lcd_frame" x="-40" y="-12" width="80" height="24" rx="2" />
</g>

<style lang="scss">
  .lcd {
    fill: var(--slate-9);
    &_text {
      text-anchor: middle;
      dominant-baseline: middle;
      font-weight: 400;
      font-size: 9px;
      fill: var(--slate-3);
      filter: url(#roulette-lcd_text-filter);
      clip-path: url(#roulette-lcd_text-clip);

      &-clip-rect {
        animation: roulette-lcd-text 0.2s linear forwards;
      }
    }
    &_frame {
      stroke: url(#roulette-lcd_inset);
      fill: transparent;
    }
  }
  @keyframes -global-roulette-lcd-text {
    0% {
      transform: translateX(-100px);
    }
    100% {
      transform: translateX(0px);
    }
  }
</style>
