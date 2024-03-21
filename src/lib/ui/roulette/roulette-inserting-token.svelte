<script lang="ts">
  import { tokenSrc } from "./roulette-resources";

  interface Props {
    onanimationend: () => void;
  }
  let { onanimationend } = $props<Props>();
</script>

<defs>
  <clipPath id="inserting-token_mask">
    <rect x="-8" y="-1" width="16" height="20" />
  </clipPath>
</defs>

<g class="_">
  <image
    class="inserting-token"
    x="-8"
    y="-18"
    width="16"
    height="16"
    href={tokenSrc}
    {onanimationend}
  ></image>
</g>

<style lang="scss">
  ._ {
    transform: translate(-30px, 80px);
    clip-path: url(#inserting-token_mask);
  }
  .inserting-token {
    animation: inserting-token 1s forwards;
  }
  @keyframes -global-inserting-token {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    25% {
      opacity: 100;
      transform: translateY(15px);
    }
    50% {
      transform: translateY(15px);
    }
    100% {
      transform: translateY(0px);
    }
  }
</style>
