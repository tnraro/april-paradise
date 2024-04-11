<script lang="ts">
  import { type Snippet } from "svelte";
  import { fly } from "svelte/transition";
  import { focusTrap } from "../actions/focus-trap";
  import { portal } from "../actions/portal";

  interface Props {
    children: Snippet;
  }
  let { children }: Props = $props();
</script>

<div
  in:fly={{ duration: 200, y: 500 }}
  out:fly={{ duration: 200, y: 500 }}
  class="drawer"
  use:portal
  use:focusTrap
>
  {@render children()}
</div>

<style lang="scss">
  @use "$lib/ui/styles/mixin";
  .drawer {
    @include mixin.select-none;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    max-height: 50dvh;
    padding: 1rem;
    border-radius: 0.5rem 0.5rem 0 0;
    background: white;
    box-shadow: var(--height-4);
    overflow: auto;
  }
</style>
