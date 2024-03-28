<script lang="ts">
  import { portal } from "$lib/ui/actions/portal";
  import { type Snippet, tick } from "svelte";

  interface Props {
    children: Snippet;
    pos: { x: number; y: number };
  }
  let self: HTMLElement;
  let { children, pos }: Props = $props();
  let dx = $state(0);
  let dy = $state(0);
  $effect(() => {
    const _ = pos;
    tick().then(() => {
      const rect = self.getBoundingClientRect();
      if (visualViewport == null) return;
      const viewport = visualViewport;
      const left = pos.x - rect.width / 2;
      const right = left + rect.width;

      dx = viewport.pageLeft;
      dy = viewport.pageTop;

      if (left < 0) {
        dx += -left;
      } else if (right > viewport.width) {
        dx += viewport.width - right;
      }
    });
  });
</script>

<div
  bind:this={self}
  class="tooltip"
  use:portal
  style:---x="{pos.x + dx}px"
  style:---y="{pos.y + dy}px"
>
  {@render children()}
</div>

<style lang="scss">
  .tooltip {
    position: absolute;
    width: min(20rem, 90%);
    align-items: center;
    gap: 0.5rem;
    left: var(---x);
    top: var(---y);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: white;
    transform: translateX(-50%);
    box-shadow: var(--height-3);
    & > :global(*:first-child) {
      flex: 1 1 min-content;
    }
  }
</style>
