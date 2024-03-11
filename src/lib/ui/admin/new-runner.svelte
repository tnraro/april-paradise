<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { req } from "$lib/api/client";
  import type { PostAdminRunners } from "../../../routes/api/admin/runners/+server";

  interface State {
    name: string;
    twitterId: string;
  }
  interface Props {
    onclose?: () => void;
  }
  let { onclose } = $props<Props>();

  const onsubmit = async () => {
    const res = await req<PostAdminRunners>("POST", "/api/admin/runners", currentState);
    if (res.ok) {
      if (res.data.created) {
        invalidate("admin:runners");
        onclose?.();
      }
    } else {
      error = res.error.message;
    }
  };
  const oncancel = () => {
    currentState = {
      name: defaults.name,
      twitterId: defaults.twitterId,
    };
  };

  let defaults = $state<State>({
    name: "",
    twitterId: "",
  });

  let currentState = $state<State>({
    name: defaults.name,
    twitterId: defaults.twitterId,
  });
  let error = $state<string | null>(null);

  let isModified = $derived(
    currentState.name !== defaults.name || currentState.twitterId !== defaults.twitterId,
  );
</script>

<div>
  <input bind:value={currentState.name} name="name" required placeholder="캐릭터 이름" />
  @<input
    bind:value={currentState.twitterId}
    name="twitter_id"
    minlength={4}
    maxlength={15}
    pattern="^[\w_]+$"
    required
    placeholder="트위터 ID"
  />
  {#if isModified}
    <button onclick={onsubmit}>적용</button>
    <button type="reset" onclick={oncancel}>취소</button>
  {/if}
</div>
{#if error != null}
  <div>{error}</div>
{/if}
