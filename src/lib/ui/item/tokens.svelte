<script lang="ts">
  interface Props {
    quantity: number;
  }
  let { quantity }: Props = $props();
</script>

<span class="tokens">
  <enhanced:img src="$img/token.png?w=24" />
  토큰 {quantity}
</span>

<style>
  .tokens {
    display: inline-flex;
    gap: 0.25rem;
    color: var(--yellow-11);
  }
</style>
