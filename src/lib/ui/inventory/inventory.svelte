<script lang="ts">
  import type { Snippet } from "svelte";
  
  interface Props {
    children: Snippet;
  }
  let { children }: Props = $props();
</script>

<div class="inventory">
  {@render children()}
</div>

<style lang="scss">
  .inventory {
    display: grid;
    grid-template-columns: repeat(auto-fill, 64px);
    gap: 1rem;
    justify-content: center;
  }
</style>
