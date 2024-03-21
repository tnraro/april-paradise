<script lang="ts">
  interface Props {
    x?: number;
    y?: number;
    r?: number;
  }
  let { x = 0, y = 0, r = 0 } = $props<Props>();

  let cx = $derived(Math.cos((r / 180) * Math.PI) * 80);
  let cy = $derived(Math.sin((r / 180) * Math.PI) * 80);
  let a = 1.6;
  let px = $derived(cx + Math.cos(Math.sin((r / 180) * Math.PI)) * 20);
  let py = $derived(cy + Math.sin(Math.sin((r / 180) * Math.PI)) * 20);
</script>

<g transform="translate({x} {y})">
  <path class="rod" d="M0 0 Q {cx} {cy} {px} {py}" />
  <path class="line" d="M{px} {py} L {px} {0 - y}" />
</g>

<style lang="scss">
  .rod {
    stroke: red;
    fill: transparent;
  }
  .line {
    stroke: blue;
    fill: transparent;
  }
</style>
