<script lang="ts">
  import FishingRod from "./fishing-rod.svelte";

  interface Props {
    x?: number;
    y?: number;
  }
  let { x = 0, y = 0 } = $props<Props>();
  let value = $state(-20);
</script>

<g transform="translate({x} {y})">
  <rect x="-60" y="-10" width="120" height="30"> </rect>
  <FishingRod x={10} y={-10} r={value} />
</g>
