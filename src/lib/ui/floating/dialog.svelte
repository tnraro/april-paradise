<script lang="ts">
  import { focusTrap } from "$lib/ui/actions/focus-trap";
  import { portal } from "$lib/ui/actions/portal";
  import type { Snippet } from "svelte";
  import { backOut } from "svelte/easing";
  import { scale } from "svelte/transition";
  import Backdrop from "./backdrop.svelte";

  interface Props {
    children: Snippet;
    onclose?: () => void;
  }
  let { children, onclose }: Props = $props();
</script>

<Backdrop {onclose} />
<div
  in:scale={{ duration: 200, easing: backOut }}
  out:scale={{ duration: 200, easing: backOut }}
  class="dialog"
  use:portal
  use:focusTrap
>
  {@render children()}
</div>

<style lang="scss">
  .dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    width: min(20rem, 90%);
    max-height: 100dvh;
    padding: 1rem;
    border-radius: 0.5rem;
    transform: translate(-50%, -50%);
    background: white;
    box-shadow: var(--height-4);
    overflow: auto;
  }
</style>
