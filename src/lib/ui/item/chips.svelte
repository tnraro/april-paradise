<script lang="ts">
  interface Props {
    quantity: number;
  }
  let { quantity }: Props = $props();
</script>

<span class="chips">칩 {quantity}</span>

<style>
  .chips {
    color: var(--blue-11);
  }
</style>
