<script lang="ts">
  import Icon from "$img/icon.svelte";

  const enum State {
    Idle,
    Pending,
    Error,
    Done,
  }
  interface Props {
    triggerType: string;
    title: string;
    disabled?: boolean;
    onclick?: () => void | Promise<void>;
    ondone?: () => void;
  }
  let { triggerType, title, disabled, onclick, ondone }: Props = $props();
  let s = $state<State>(State.Idle);
</script>

<button
  class="_"
  disabled={disabled || s === State.Pending || s === State.Error}
  onclick={async () => {
    s = State.Pending;
    try {
      await onclick?.();
      s = State.Done;
    } catch (_) {
      s = State.Error;
    }
    ondone?.();
  }}
>
  <span>{title}</span>
  {#if s === State.Idle}
    <span>{triggerType}</span>
  {:else if s === State.Pending}
    <Icon as="loader-circle" />
  {:else if s === State.Error}
    <Icon as="x" />
  {:else if s === State.Done}
    <Icon as="check" />
  {/if}
</button>

<style>
  ._ {
    justify-content: space-between;
  }
</style>
