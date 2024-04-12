<script lang="ts">
  import type { ItemData } from "$lib/data/sheets/model";
  import { z } from "zod";
  import Dialog from "../floating/dialog.svelte";
  import NewReward from "./new-reward.svelte";

  interface Props {
    items: ItemData[];
    onclose?: () => void;
    onsubmit?: (data: {
      sender: string;
      title: string;
      body: string;
      rewards: string;
    }) => void | Promise<void>;
  }
  let { items, onclose, onsubmit }: Props = $props();
  let isLoading = $state(false);

  let rewards = $state.frozen(new Map<string, number>());
  let isNewReward = $state(false);

  let itemMap = $derived(new Map(items.map((x) => [x.key, x])));

  let error = $state<string>();
</script>

<form
  class="form"
  onreset={() => {
    rewards = new Map();
    onclose?.();
  }}
  onsubmit={async (e) => {
    e.preventDefault();
    isLoading = true;
    const data = new FormData(e.currentTarget);
    const sender = z.string().parse(data.get("sender"));
    const title = z.string().parse(data.get("title"));
    const body = z.string().parse(data.get("body"));
    const rewards = z.string().parse(data.get("rewards"));
    try {
      await onsubmit?.({
        sender,
        title,
        body,
        rewards,
      });
      onclose?.();
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "String must contain at least 1 character(s)") {
          error = "보상을 추가하세요";
        }
      }
    }
    isLoading = false;
  }}
>
  <label for="mail__title">제목</label>
  <input id="mail__title" name="title" required />
  <label for="mail__body">본문</label>
  <textarea id="mail__body" name="body" required />
  <label for="mail__reward">보상</label>
  <input
    type="hidden"
    id="mail__reward"
    name="rewards"
    value={[...rewards.entries()].map((x) => `${x[0]}:${x[1]}`)}
  />
  <button type="button" class="rewards" onclick={() => (isNewReward = true)}>
    {#if rewards.size > 0}
      {#each rewards as [key, quantity] (key)}
        <span class="reward">{itemMap.get(key)?.name}×{quantity}</span>
      {/each}
    {:else}
      보상을 추가하세요
    {/if}
  </button>
  <label for="mail__sender">보내는 사람</label>
  <input id="mail__sender" name="sender" required value="총괄" />
  <input type="hidden" />
  <div class="form__footer">
    <button type="reset" onclick={onclose}>취소</button>
    <button class="blue emphasis" disabled={isLoading}>우편 발송</button>
  </div>
</form>

{#if isNewReward}
  <Dialog>
    <NewReward
      {items}
      onclose={(s) => {
        if (s) {
          rewards = new Map(rewards);
          rewards.set(s.item, (rewards.get(s.item) ?? 0) + s.quantity);
        }
        isNewReward = false;
      }}
    />
  </Dialog>
{/if}

{#if error}
  <Dialog onclose={() => (error = undefined)}>
    <div>{error}</div>
    <button onclick={() => (error = undefined)}>닫기</button>
  </Dialog>
{/if}

<style lang="scss">
  .form {
    display: grid;
    align-items: end;
    gap: 0.5rem;
    &__footer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }
  }
  label {
    margin-bottom: -0.5rem;
  }
  textarea {
    resize: vertical;
  }
  .rewards {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .reward {
    background: var(--slate-5);
    border-radius: 0.25rem;
    padding: 0 0.25rem;
  }
</style>
