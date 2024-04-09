<script lang="ts">
  import { api } from "$lib/api/api.gen";
  import { sendError } from "$lib/ui/error/send-error";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import { Menubar } from "bits-ui";
  import SendMail from "../../../lib/ui/mail/send-mail.svelte";

  let { data } = $props();

  let selected = $state.frozen(new Set<string>());

  let isEdit = $state(false);
</script>

<Menubar.Root class="runners-menu">
  <input
    type="checkbox"
    checked={selected.size === data.runners.length}
    oninput={(e) => {
      const { checked } = e.currentTarget;
      if (checked) {
        selected = new Set(data.runners.map((x) => x.id));
      } else {
        selected = new Set();
      }
    }}
  />
  <Menubar.Menu>
    <Menubar.Trigger>편집</Menubar.Trigger>
    <Menubar.Content align="start" sideOffset={4}>
      <Menubar.Item
        disabled={selected.size <= 0}
        onclick={async (e: { currentTarget: HTMLElement }) => {
          if (e.currentTarget.dataset.disabled != null) return;
          isEdit = true;
        }}
      >
        우편 보내기
      </Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>

<div class="_">
  {#each data.runners as runner (runner.id)}
    <div class="runner">
      <input
        type="checkbox"
        checked={selected.has(runner.id)}
        oninput={(e) => {
          const { checked } = e.currentTarget;
          const set = new Set(selected);
          if (checked) {
            set.add(runner.id);
          } else {
            set.delete(runner.id);
          }
          selected = set;
        }}
      />
      <div class="runner__identity">
        <div class="runner__name" title={runner.name}>
          {runner.name}
        </div>
        {#if runner.isBanned}
          <div class="badge badge--banned">제명됨</div>
        {/if}
      </div>
      <div class="money money--token" title="{runner.tokens} 토큰">
        <enhanced:img src="$img/token.png?w=16" />
        <span class="money__number">{runner.tokens}</span>
      </div>
      <div class="money money--chip" title="{runner.chips} 칩">
        <enhanced:img src="$img/chip.png?w=16" />
        <span class="money__number">{runner.chips}</span>
      </div>
    </div>
  {/each}
</div>

{#if isEdit}
  <Dialog>
    <SendMail
      items={data.itemData}
      onclose={() => (isEdit = false)}
      onsubmit={async (data) => {
        const res = await api().mail.post({
          ...data,
          recipients: [...selected.values()],
        });
        if (!res.ok) {
          sendError(res.error.message);
        }
      }}
    />
  </Dialog>
{/if}

<style lang="scss">
  @use "sass:math";
  .runner {
    padding: 0 1rem;
    display: grid;
    grid-template-columns: max-content 8rem 4rem 4rem;
    gap: 0 1ch;

    &__identity {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    &__name {
      font-weight: 700;
      word-break: keep-all;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .money {
    display: grid;
    align-items: center;
    grid-template-columns: 1rem 1fr;
    gap: 0.5ch;
    text-align: right;
    justify-content: space-between;
    &--chip {
      color: var(--blue-11);
    }
    &--token {
      color: var(--amber-11);
    }
    &__number {
      word-break: keep-all;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  :global(.runners-menu) {
    padding: 0.25rem 1rem;
    border-radius: 0.25rem;
    display: flex;
    background: var(--slate-3);
    gap: 0.5rem;
  }
  .badge {
    border-radius: 0.25rem;
    padding: 0 0.25rem;
    font-size: 0.75rem;
    word-break: keep-all;

    &--admin {
      background: var(--green-9);
      color: var(--green-1);
    }
    &--banned {
      background: var(--red-9);
      color: var(--red-1);
    }
  }
</style>
