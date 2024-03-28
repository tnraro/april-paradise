<script lang="ts">
  interface Props {
    quantity: number;
  }
  let { quantity }: Props = $props();
</script>

<span class="tokens">토큰 {quantity}</span>

<style>
  .tokens {
    color: var(--yellow-11);
  }
</style>
