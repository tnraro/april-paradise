<script lang="ts">
  interface Props {
    name: string;
    quantity?: number;
  }
  let { name, quantity }: Props = $props();
</script>

{#if quantity == null || quantity === 1}
  <span class="items">{name}</span>
{:else}
  <span class="items">{name}×{quantity}</span>
{/if}

<style>
  .items {
  }
</style>
