<script lang="ts">
  interface Props {
    quantity: number;
  }
  let { quantity } = $props<Props>();
</script>

<span class="chips">칩 {quantity}</span>

<style>
  .chips {
    color: var(--blue-11);
  }
</style>
