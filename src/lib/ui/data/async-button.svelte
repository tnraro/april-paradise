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
    onclick?: () => Promise<void> | void;
  }
  let { text, done, onclick }: Props = $props();

  let _s = $state<State>(State.Idle);
  let s = $derived.by(() => {
    if (done) return State.Done;

    return _s;
  });
</script>

<button
  class="blue emphasis"
  disabled={s !== State.Idle}
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
  {text}

  {#if s === State.Pending}
    <div class="animate-spin">
      <Icon as="loader-circle" />
    </div>
  {:else if s === State.Done}
    <Icon as="check" />
  {:else if s === State.Error}
    <Icon as="x" />
  {/if}
</button>

<style lang="scss">
  button {
    justify-content: space-between;
    align-items: center;
  }
</style>
