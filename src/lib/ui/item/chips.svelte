<script lang="ts">
  interface Props {
    quantity: number;
  }
  let { quantity }: Props = $props();
</script>

<span class="chips">
  <enhanced:img alt="" src="$img/chip.png?w=24" />
  칩 {quantity}
</span>

<style>
  .chips {
    display: inline-flex;
    gap: 0.25rem;
    color: var(--blue-11);
    align-items: center;
  }
</style>
