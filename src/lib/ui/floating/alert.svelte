<script lang="ts">
  import type { Snippet } from "svelte";
  import { portal } from "$lib/ui/actions/portal";
  import { focusTrap } from "$lib/ui/actions/focus-trap";

  interface Props {
    children: Snippet;
  }
  let { children } = $props<Props>();
</script>

<div class="alert" use:portal={{ containerId: "alerts" }} use:focusTrap>
  {@render children()}
</div>

<style lang="scss">
  .alert {
    display: flex;
    position: fixed;
    bottom: 1rem;
    left: 50%;
    width: min(20rem, 90%);
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transform: translate(-50%, 0);
    background: white;
    box-shadow: var(--height-4);
    & > :global(*:first-child) {
      flex: 1 1 min-content;
    }
  }
</style>
