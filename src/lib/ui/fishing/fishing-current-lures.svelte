<script lang="ts">
  import { lures } from "$lib/shared/config/lures";
  import Lure from "$lib/ui/item/lure.svelte";
  import type { Lures } from "$routes/(main)/events/fishing/lures.svelte";

  interface Props {
    currentLures: Lures;
  }
  let { currentLures }: Props = $props();
</script>

<div class="_">
  {#each lures as lure}
    <div class="lure">
      <Lure {lure} />
      <div class="lure__quantity">×{currentLures[lure]}</div>
    </div>
  {/each}
</div>

<style lang="scss">
  ._ {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: hsl(0deg 0% 100% / 0.9);
    border-radius: 99999rem;
    width: max-content;
  }
  .lure {
    display: inline-flex;
    align-items: center;
    & :global(img.lure) {
      width: 24px;
      height: 24px;
    }
  }
</style>
