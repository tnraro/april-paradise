<script lang="ts">
  import { getItems } from "$img/imgs";

  interface Props {
    lure: string;
  }
  let { lure }: Props = $props();
  let src = $state<string>();
  $effect(() => {
    getItems(lure)?.then((x) => {
      src = x.default;
    });
  });
</script>

{#if src}
  <enhanced:img class="lure" {src} />
{/if}

<style>
  .lure {
    max-width: fit-content;
  }
</style>
