<script lang="ts">
  import { getItems } from "$img/items.gen";

  interface Props {
    lure: string;
  }
  let { lure }: Props = $props();
  let src = $derived(getItems(lure));
</script>

{#if src != null}
  <enhanced:img alt="" class="lure" {src} />
{/if}

<style>
  .lure {
    max-width: fit-content;
  }
</style>
