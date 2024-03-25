<script lang="ts">
  import type { CaughtFish } from "./fishing-state.svelte";

  interface Props {
    fish: Pick<CaughtFish, "catchphrase">;
  }
  let { fish } = $props<Props>();
  let catchphrase = $derived(fish.catchphrase?.split(/\s*[\/\n]\s*/) ?? []);
</script>

<div class="catchphrase">
  {#each catchphrase as line}
    <p>{line}</p>
  {/each}
</div>

<style lang="scss">
  .catchphrase {
    border: 1px solid var(--slate-6);
    padding: 1rem;
    border-radius: 0.25rem;
    word-break: keep-all;
  }
</style>
