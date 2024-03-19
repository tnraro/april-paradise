<defs>
  <radialGradient id="token-slot_bg" cx="60%" cy="75%" r="100%">
    <stop offset="0%" stop-color="var(--sand-4)"></stop>
    <stop offset="100%" stop-color="var(--sand-7)"></stop>
  </radialGradient>
  <linearGradient id="token-slot_inset" gradientTransform="rotate(45)">
    <stop offset="50%" stop-color="var(--sand-7)"></stop>
    <stop offset="90%" stop-color="var(--sand-4)"></stop>
  </linearGradient>
  <linearGradient id="roulette-body_outline" gradientTransform="rotate(45)">
    <stop offset="50%" stop-color="var(--sand-6)"></stop>
    <stop offset="90%" stop-color="var(--sand-7)"></stop>
  </linearGradient>
</defs>

<rect class="body" x="-50" y="73" width="100" height="65" rx="2" />

<g transform="translate(-30, 80)">
  <ellipse rx="10" ry="5" fill="url(#token-slot_bg)" />
  <rect class="slot" x="-8" y="-1" width="16" height="2" />
</g>

<style lang="scss">
  .body {
    stroke: url(#roulette-body_outline);
    fill: var(--sand-3);
  }
  .slot {
    fill: var(--sand-12);
    stroke: url(#token-slot_bevel);
    paint-order: stroke;
    stroke-linejoin: round;
  }
</style>
