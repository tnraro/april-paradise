<script lang="ts">
  import { getRelativeTimeString } from "../time/get-relative-time-string";

  interface Props {
    mails: {
      id: string;
      sender: string;
      title: string;
      isReceived: boolean;
      createdAt: Date;
    }[];
    onclick?: (id: string) => void;
  }
  let { mails, onclick }: Props = $props();
</script>

<div class="mail-list">
  {#each mails as mail (mail.id)}
    <button
      class="mail"
      onclick={() => {
        onclick?.(mail.id);
      }}
    >
      <div class="mail__header">
        <span class="mail__sender">{mail.sender}</span>
        <span class="mail__created-at"
          >{getRelativeTimeString(mail.createdAt)}</span
        >
        {#if mail.isReceived}
          <span class="mail__is-received">보상 받음</span>
        {/if}
      </div>
      <div class="mail__body">
        <span class="mail__title">{mail.title}</span>
      </div>
    </button>
  {/each}
</div>

<style lang="scss">
  .mail-list {
    display: grid;
  }
  .mail {
    all: unset;
    cursor: pointer;
    padding: 0.25rem 0;
    &:hover {
      background: var(--slate-1);
    }
    &:active {
      background: var(--slate-2);
    }
    &__header {
      display: flex;
      align-items: baseline;
      gap: 1ch;
    }
    &__body {
      display: flex;
    }
    &__sender {
      font-weight: 700;
    }
    &__created-at {
      color: var(--slate-11);
      font-size: 0.75rem;
    }
    &__is-received {
      color: var(--slate-11);
      font-size: 0.75rem;
    }
  }
</style>
