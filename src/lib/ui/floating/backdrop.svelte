<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { portal } from "../actions/portal";

  const onkeydown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    if (onclose == null) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    onclose();
  };

  interface Props {
    onclose?: () => void;
  }
  let { onclose }: Props = $props();
</script>

<button
  class="backdrop"
  in:fade={{ duration: 200 }}
  out:fade={{ duration: 200 }}
  use:portal
  onclick={onclose}
></button>
<svelte:window {onkeydown} />

<style>
  .backdrop {
    all: unset;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--slate-a9);
    backdrop-filter: blur(4px);
  }
</style>
