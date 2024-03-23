<script lang="ts">
  import FishingBoat from "./fishing-boat.svelte";
  interface Props {
    height?: number;
  }
  let { height = 1000 } = $props<Props>();
</script>

<g transform="translate(0 {1000 - height})">
  <animateTransform
    attributeName="transform"
    attributeType="XML"
    type="translate"
    values="0 -20;0 20;0 -20"
    keySplines="
    0.5 0.1 0.5 0.9;
    0.5 0.1 0.5 0.9"
    keyTimes="0;0.5;1"
    calcMode="spline"
    dur="5s"
    repeatCount="indefinite"
  />
  <FishingBoat />
  <rect class="wave" x="-50%" width="110%" height={height + 4} />
</g>

<style class="style">
  .wave {
    fill: var(--slate-a6);
    stroke: white;
    stroke-width: 4;
  }
</style>
