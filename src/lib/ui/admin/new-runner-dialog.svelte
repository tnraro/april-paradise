<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { api } from "$lib/api/api.gen";
  import { deepEqual } from "$lib/shared/util/deep-equal";
  import Dialog from "../floating/dialog.svelte";

  interface State {
    name: string;
    twitterId: string;
  }
  interface Props {
    onclose?: () => void;
  }
  let { onclose }: Props = $props();

  const onsubmit = async () => {
    // const res = await api().runners.post({
    //   name: currentState.name,
    //   twitterId: currentState.twitterId.replace(/^@/, ""),
    // });
    // if (res.ok) {
    //   if (res.data.created) {
    //     invalidate("admin:runners");
    //     onclose?.();
    //   }
    // } else {
    //   error = res.error.message;
    // }
  };
  const onreset = () => {
    currentState = { ...defaults };
  };

  const defaults = {
    name: "",
    twitterId: "",
  };

  let currentState = $state<State>({ ...defaults });
  let error = $state<string | null>(null);

  let isValid = $derived(
    currentState.name.length > 1 &&
      /^@[\w_]{4,15}$/.test(currentState.twitterId),
  );
  let isEdited = $derived(!deepEqual(currentState, defaults));
</script>

<Dialog onclose={() => isEdited || onclose?.()}>
  <div class="new-runner-dialog">
    <h1>러너 추가</h1>
    <div class="new">
      <input
        bind:value={currentState.name}
        name="name"
        required
        placeholder="캐릭터 이름"
      />
      <input
        bind:value={currentState.twitterId}
        oninput={() => {
          if (!/^@/.test(currentState.twitterId)) {
            currentState.twitterId = `@${currentState.twitterId}`;
          }
        }}
        name="twitterId"
        minlength={4}
        maxlength={15}
        pattern="^[\w_]+$"
        required
        placeholder="@트위터 ID"
      />
    </div>
    {#if error != null}
      <div class="error">{error}</div>
    {/if}
    <div class="buttons">
      <button type="reset" onclick={onreset} disabled={!isEdited}>재설정</button
      >
      <button class="blue emphasis" onclick={onsubmit} disabled={!isValid}
        >적용</button
      >
    </div>
  </div>
</Dialog>

<style lang="scss">
  .new-runner-dialog {
    display: grid;
    gap: 0.5rem;
  }
  .new {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    align-items: center;
  }
  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  .error {
    color: var(--red-11);
  }
</style>
