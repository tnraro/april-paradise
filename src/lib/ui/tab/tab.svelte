<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    prefix: string;
    n: number;
    tab: Snippet<[number]>;
    tabpanel: Snippet<[number]>;
  }
  let { prefix, n, tab, tabpanel }: Props = $props();

  let index = $state(0);
</script>

<div role="tablist" class="{prefix}__tablist">
  {#each { length: n } as _, i}
    <button
      role="tab"
      id="{prefix}-{i}__tab"
      class="{prefix}__tab"
      aria-selected={index === i}
      aria-controls="{prefix}-{i}__tabpanel"
      onclick={() => (index = i)}
    >{@render tab(i)}</button>
  {/each}
</div>
<div
  role="tabpanel"
  id="{prefix}-{index}__tabpanel"
  class="{prefix}__tabpanel"
  aria-labelledby="{prefix}-{index}__tab"
>{@render tabpanel(index)}</div>
