<script lang="ts">
  import Icon from "$img/icon.svelte";

  const enum State {
    Idle,
    Pending,
    Done,
    Error,
  }

  interface Props {
    text: string;
    done?: boolean;
    color?: string;
    pendingText?: string;
    doneText?: string;
    errorText?: string;
    onclick?: () => Promise<void> | void;
  }
  let {
    text,
    done,
    onclick,
    color = "blue",
    pendingText,
    doneText,
    errorText,
  }: Props = $props();

  let _s = $state<State>(State.Idle);
  let s = $derived.by(() => {
    if (done) return State.Done;

    return _s;
  });
</script>

<button
  class="{color} emphasis"
  disabled={onclick == null || s !== State.Idle}
  onclick={async () => {
    _s = State.Pending;
    try {
      await onclick?.();
      _s = State.Done;
    } catch (_) {
      _s = State.Error;
    }
  }}
>
  {#if s === State.Idle}
    {text}
  {:else if s === State.Pending}
    {pendingText ?? text}
    <div class="animate-spin">
      <Icon as="loader-circle" />
    </div>
  {:else if s === State.Done}
    {doneText ?? text}
    <Icon as="check" />
  {:else if s === State.Error}
    {errorText ?? text}
    <Icon as="x" />
  {/if}
</button>

<style lang="scss">
  button {
    justify-content: space-between;
    align-items: center;
  }
</style>
