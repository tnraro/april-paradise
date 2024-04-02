<script lang="ts">
  import { repeat } from "$lib/shared/util/repeat";
  import { tick, untrack } from "svelte";
  import Chips from "./chips.svelte";
  import Tokens from "./tokens.svelte";

  interface Props {
    type: "chips" | "tokens";
    quantity: number;
  }
  let { type, quantity }: Props = $props();
  let q = $state(quantity);
  let t = quantity;

  $effect(() => {
    const k = untrack(() => q);
    if (quantity === k) return;
    const length = quantity - k;
    tick().then(async () => {
      t = quantity;
      const t2 = quantity;
      const dir = Math.floor(length / 8);
      q += length % 8;
      for await (const _ of repeat(8, 50)) {
        if (t !== t2) break;
        q += dir;
      }
      q = quantity;
    });
  });
</script>

{#if type === "chips"}
  <Chips quantity={q} />
{:else if type === "tokens"}
  <Tokens quantity={q} />
{/if}
