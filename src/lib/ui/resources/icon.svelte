<script lang="ts">
  interface Props {
    as:
      | "menu"
      | "inbox"
      | "user-circle2"
      | "package2"
      | "log-in"
      | "log-out"
      | "home"
      | "wrench"
      | "shopping-cart"
      | "trash2"
      | "loader-circle"
      | "x"
      | "check";
    size?: number;
    "stroke-width"?: number;
  }
  let { as, size = 24, "stroke-width": strokeWidth = 2 }: Props = $props();
</script>

<svg
  class="lucide lucide-{as}"
  viewBox="0 0 24 24"
  width={size}
  height={size}
  style:--stroke-width={strokeWidth}
>
  <use href="/icons.svg#{as}" />
</svg>

<style>
  :global(:where(.lucide)) {
    fill: none;
    stroke: currentColor;
    stroke-width: var(--stroke-width);
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
