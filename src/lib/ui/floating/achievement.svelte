<script lang="ts">
  import type { Money } from "$lib/data/sheets/model";
  import { portal } from "$lib/ui/actions/portal";
  import { fly } from "svelte/transition";
  import Item from "../item/item.svelte";

  interface Props {
    name: string;
    condition: string;
    reward: Money;
    isHidden: boolean;
    onclose?: () => void;
  }
  let { name, condition, reward, isHidden, onclose }: Props = $props();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="achievement"
  use:portal={{ containerId: "achievements" }}
  in:fly={{ y: -100 }}
  onclick={onclose}
>
  <div>
    <h1>{name}</h1>
    <p>
      {#if isHidden}
        <span class="is-hidden">히든</span>
      {/if}
      {condition}
    </p>
  </div>
  <Item item={reward} />
</div>

<style lang="scss">
  @use "$lib/ui/styles/mixin";
  h1 {
    font-size: 1rem;
    line-height: 1.5;
  }
  .achievement {
    @include mixin.select-none;
    display: flex;
    position: fixed;
    top: 0;
    left: 50%;
    width: min(20rem, 90%);
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transform: translate(-50%, 0);
    background: white;
    box-shadow: var(--height-4);
    transition: top 200ms ease-out;
    & > :global(*:first-child) {
      flex: 1 1 min-content;
    }
    @for $i from 1 to 11 {
      &:nth-child(#{$i}) {
        top: ($i - 1) * 5rem + 1rem;
      }
    }
  }
  .is-hidden {
    padding: 0 0.25rem;
    background: var(--red-9);
    color: var(--red-1);
    border-radius: 0.25rem;
  }
</style>
