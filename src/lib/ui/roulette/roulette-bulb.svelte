<script lang="ts">
  interface Props {
    x: number;
    y: number;
    on: boolean;
  }
  let { x, y, on }: Props = $props();
</script>

<circle class="bulb" class:bulb--on={on} r="1.4" cx={x} cy={y} />

<style lang="scss">
  .bulb {
    fill: var(--yellow-11);
    &--on {
      fill: var(--yellow-9);
      filter: url(#bulb_blur);
    }
  }
</style>
