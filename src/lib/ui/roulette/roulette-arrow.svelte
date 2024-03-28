<script lang="ts">
  interface Props {
    x: number;
    y: number;
    r?: number;
    color?: string;
  }
  let { x, y, r = 0, color = "var(--blue-9)" }: Props = $props();
</script>

<g class="arrow" transform="translate({x} {y})">
  <path
    class="arrow_path"
    d="m0-3V-6L6 0L0 6V3H-6V-3z"
    transform="rotate({r})"
    fill={color}
  />
</g>

<!-- transform="translate(21, 59.5)" -->

<style lang="scss">
  .arrow {
    filter: drop-shadow(1px 1px 0 var(--red-12));
    stroke: var(--sand-6);
    &_path {
      stroke: var(--sand-6);
      stroke-width: 1px;
    }
  }
</style>
