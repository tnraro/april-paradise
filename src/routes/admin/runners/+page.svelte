<script lang="ts">
  import { api } from "$lib/api/api.gen";
  import { sendError } from "$lib/ui/error/send-error";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import SendMail from "../../../lib/ui/mail/send-mail.svelte";

  let { data } = $props();

  let selected = $state.frozen(new Set<string>());

  let isEdit = $state(false);
</script>

<div class="runners-menu">
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
  <button
    disabled={selected.size <= 0}
    onclick={async () => {
      isEdit = true;
    }}>편집</button
  >
</div>

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
      <div class="runner__name" title={runner.name}>
        {runner.name}
      </div>
      <a
        class="x-id"
        href="https://twitter.com/{runner.twitterId}"
        target="_blank"
        rel="noreferrer"
        title="@{runner.twitterId}">𝕏</a
      >
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
      items={data.items}
      onclose={() => (isEdit = false)}
      onsubmit={async (data) => {
        const res = await api().mail.post({
          ...data,
          recipients: [...selected.values()],
        });
        if (!res.ok) {
          sendError(res.error.message);
        } else {
          console.log(res.data);
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
    grid-template-columns: max-content 6rem max-content 4rem 4rem;
    gap: 0 1ch;

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
  .runners-menu {
    padding: 0.25rem 1rem;
    border-radius: 0.25rem;
    display: flex;
    background: var(--slate-3);
    gap: 0.5rem;
  }
</style>
