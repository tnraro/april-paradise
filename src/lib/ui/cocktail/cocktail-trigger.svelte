<script lang="ts">
  import { invalidateAll } from "$app/navigation";
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
    done?: boolean;
    onclick?: () => void | Promise<void>;
    ondone?: () => void;
  }
  let { triggerType, title, disabled, done, onclick, ondone }: Props = $props();
  let s = $state<State>(State.Idle);
</script>

<button
  class="_"
  disabled={disabled || s !== State.Idle || done}
  onclick={async () => {
    s = State.Pending;
    try {
      await onclick?.();
      s = State.Done;
      invalidateAll();
    } catch (_) {
      s = State.Error;
    }
    ondone?.();
  }}
>
  <span>{title}</span>
  {#if done || s === State.Done}
    <Icon as="check" />
  {:else if s === State.Idle}
    <span>{triggerType}</span>
  {:else if s === State.Pending}
    <div class="spin">
      <Icon as="loader-circle" />
    </div>
  {:else if s === State.Error}
    <Icon as="x" />
  {/if}
</button>

<style>
  ._ {
    justify-content: space-between;
  }
  .spin {
    animation: spin 1s infinite;
  }
  @keyframes -global-spin {
    0% {
      transform: rotate(0turn);
    }
    100% {
      transform: rotate(1turn);
    }
  }
</style>
