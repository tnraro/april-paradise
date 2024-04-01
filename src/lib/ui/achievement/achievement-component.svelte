<script lang="ts">
  import type { Money } from "$lib/data/sheets/model";
  import Item from "../item/item.svelte";

  interface Props {
    name: string;
    condition: string;
    isHidden: boolean;
    reward: Money;
    isDone?: boolean;
  }
  let { name, condition, isHidden, reward, isDone }: Props = $props();
</script>

<div class="achievement">
  <div>
    <h1>
      {name}
    </h1>
    <p>
      {#if isHidden}
        <span class="badge badge--is-hidden">히든</span>
      {/if}
      {#if isDone}
        <span class="badge badge--is-done">달성</span>
      {/if}
      {#if !isHidden || isDone}
        {condition}
      {:else}
        ???
      {/if}
    </p>
  </div>
  <div class="reward">
    <h1>보상</h1>
    <Item item={reward} />
  </div>
</div>

<style lang="scss">
  @use "$lib/ui/styles/mixin";
  h1 {
    font-size: 1rem;
    line-height: 1.5;
  }
  p {
    color: var(--slate-11);
    word-break: keep-all;
  }
  .achievement {
    @include mixin.select-none;
    display: grid;
    align-items: center;
    gap: 0.5rem;
    grid-template-columns: 1fr max-content;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: white;

    &--is-done {
      color: var(--slate-11);
    }
  }
  .badge {
    padding: 0 0.25rem;
    border-radius: 0.25rem;
    &--is-done {
      background: var(--green-9);
      color: var(--green-1);
    }
    &--is-hidden {
      background: var(--red-9);
      color: var(--red-1);
    }
  }
  .reward {
    display: grid;
    justify-items: center;
  }
</style>
