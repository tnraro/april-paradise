<script lang="ts">
  import { useItemData } from "../data/data.svelte";
  import { sendError } from "../error/send-error";
  import Chips from "../item/chips.svelte";
  import Items from "../item/items.svelte";
  import Tokens from "../item/tokens.svelte";
  import { getRelativeTimeString } from "../time/get-relative-time-string";

  const i = Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "narrow",
    hour12: true,
    dayPeriod: "long",
    hour: "numeric",
    minute: "numeric",
  });

  const itemData = useItemData();

  interface Props {
    sender: string;
    title: string;
    body: string;
    reward: string;
    isReceived: boolean;
    createdAt: Date;
    onclick?: () => void;
    disabled?: boolean;
  }
  let {
    sender,
    title,
    body,
    reward,
    isReceived,
    createdAt,
    onclick,
    disabled,
  }: Props = $props();
  let itemMap = $derived(new Map(itemData.data?.map((x) => [x.key, x]) ?? []));
  let rewards = $derived(
    reward.length === 0
      ? []
      : reward
          .split(",")
          .map(
            (
              x,
            ):
              | { type: "chips"; quantity: number }
              | { type: "tokens"; quantity: number }
              | { type: "item"; quantity: number; name: string } => {
              const [key, _quantity] = x.split(":");
              const quantity = Number(_quantity);

              if (key === "chip") {
                return {
                  type: "chips",
                  quantity,
                };
              }
              if (key === "token") {
                return {
                  type: "tokens",
                  quantity,
                };
              }
              const item = itemMap.get(key);
              if (item == null) {
                try {
                  throw sendError("no item", key);
                } catch (error) {}
                return {
                  type: "item",
                  name: key,
                  quantity,
                };
              }
              return {
                type: "item",
                name: item.name,
                quantity,
              };
            },
          ),
  );
</script>

<div class="_">
  <h1>{title}</h1>
  <header>
    <div class="sender">{sender}</div>
    <div class="created-at">
      {i.format(createdAt)} ({getRelativeTimeString(createdAt)})
    </div>
  </header>
  <p class="body">{body}</p>
  {#if rewards.length > 0}
    <section class="reward">
      <h2>보상</h2>
      <div class="rewards">
        {#each rewards as reward}
          {#if reward.type === "chips"}
            <Chips quantity={reward.quantity} />
          {:else if reward.type === "tokens"}
            <Tokens quantity={reward.quantity} />
          {:else if reward.type === "item"}
            <Items name={reward.name} quantity={reward.quantity} />
          {/if}
        {/each}
      </div>
      {#if isReceived}
        <button disabled>보상 받음</button>
      {:else}
        <button class="green emphasis" {onclick} {disabled}>보상 받기</button>
      {/if}
    </section>
  {/if}
</div>

<style lang="scss">
  header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  ._ {
    display: grid;
    gap: 1rem 0;
  }
  .sender {
    font-weight: 700;
  }
  .created-at {
    color: var(--slate-11);
    font-size: 0.75rem;
  }
  .rewards {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
  }
  .reward {
    display: grid;
    gap: 0.25rem;
  }
  .body {
    white-space-collapse: preserve;
  }
</style>
