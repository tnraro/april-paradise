<script lang="ts">
  interface Props {
    quantity: number;
  }
  let { quantity } = $props<Props>();
</script>

<span class="tokens">토큰 {quantity}</span>

<style>
  .tokens {
    color: var(--yellow-11);
  }
</style>
