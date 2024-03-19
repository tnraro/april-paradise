<defs>
  <path id="sign_curve" d="M-35 38C-20 19,20 19,35 38" />
  <linearGradient id="sign_shadow" gradientTransform="rotate(90)">
    <stop offset="0%" stop-color="var(--slate-a6)"></stop>
    <stop offset="100%" stop-color="transparent"></stop>
  </linearGradient>
</defs>

<rect class="sign_shadow" x="-48" y="44" width="96" height="10" />
<path
  class="sign_bg"
  d="M-48 44Q-50 44,-50 42L-50 30C-35-5,35-5,50 30L50 42Q50 44,48 44z"
/>
<text class="sign_title">
  <textPath href="#sign_curve">카락실 환전기</textPath>
</text>
<text class="sign_subtitle" y="35">로얄</text>

<style lang="scss">
  .sign {
    &_shadow {
      fill: url(#sign_shadow);
    }
    &_bg {
      stroke: var(--sand-6);
      fill: var(--red-9);
    }
    &_title {
      font-family: var(--font-serif);
      font-size: 13.1px;
      font-weight: 900;
      paint-order: stroke;
      stroke: var(--yellow-10);
      stroke-width: 2px;
      filter: drop-shadow(1px 1px 0 var(--red-12));
    }
    &_subtitle {
      font-family: var(--font-serif);
      font-size: 9px;
      font-weight: 700;
      fill: var(--yellow-10);
      text-anchor: middle;
      dominant-baseline: middle;
      filter: drop-shadow(1px 1px 0 var(--red-12));
    }
  }
</style>
