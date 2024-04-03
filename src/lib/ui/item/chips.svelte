<script lang="ts">
  interface Props {
    quantity: number;
  }
  let { quantity }: Props = $props();
</script>

<span class="chips">
  <enhanced:img src="$img/chip.png?w=24" />
  칩 {quantity}
</span>

<style>
  .chips {
    display: inline-flex;
    gap: 0.25rem;
    color: var(--blue-11);
  }
</style>
