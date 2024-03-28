<script lang="ts">
  import { focusTrap } from "$lib/ui/actions/focus-trap";
  import { portal } from "$lib/ui/actions/portal";
  import type { Snippet } from "svelte";
  import { backOut } from "svelte/easing";
  import { fade, scale } from "svelte/transition";

  interface Props {
    children: Snippet;
    onclose?: () => void;
  }
  let { children, onclose }: Props = $props();
</script>

<button
  class="backdrop"
  in:fade={{ duration: 200 }}
  out:fade={{ duration: 200 }}
  use:portal
  onclick={onclose}
></button>
<div
  in:scale={{ duration: 200, easing: backOut }}
  out:scale={{ duration: 200, easing: backOut }}
  class="dialog"
  use:portal
  use:focusTrap
>
  {@render children()}
</div>
<svelte:window onkeydown={(e) => e.key === "Escape" && onclose?.()} />

<style lang="scss">
  .dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    width: min(20rem, 90%);
    max-height: 100dvh;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 0.5rem;
    transform: translate(-50%, -50%);
    background: white;
    box-shadow: var(--height-4);
    z-index: 4;
    overflow: auto;
    & > :global(*:first-child) {
      flex: 1 1 min-content;
    }
  }
  .backdrop {
    all: unset;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--slate-a9);
    z-index: 1;
    backdrop-filter: blur(4px);
  }
</style>
