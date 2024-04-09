<script lang="ts">
  import { api } from "$lib/api/api.gen.js";
  import { sendError } from "$lib/ui/error/send-error.js";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import InventoryItem from "$lib/ui/inventory/inventory-item.svelte";
  import Chips from "$lib/ui/item/chips.svelte";
  import Tokens from "$lib/ui/item/tokens.svelte";
  import MailList from "$lib/ui/mail/mail-list.svelte";
  import Mail from "$lib/ui/mail/mail.svelte";

  const copyInviteCode = async () => {
    const res = await api().runners.post({ key: data.user.key });
    if (!res.ok) {
      sendError(res.error.message);
    } else {
      const code = res.data.code;
      const url = `${location.origin}/invite?code=${code}`;
      await navigator.clipboard.writeText(url);
    }
  };

  let { data } = $props();

  let mail = $state<{
    id: string;
    sender: string;
    title: string;
    body: string;
    reward: string;
    isReceived: boolean;
    createdAt: Date;
  } | null>();
</script>

<main>
  <header class="title">
    <h1>{data.user.name}</h1>
    {#if !data.user.isAdmin}
      {#if data.user.twitterId}
        <a class="x-id" href="https://twitter.com/{data.user.twitterId}"
          >@{data.user.twitterId}</a
        >
      {/if}
    {/if}
  </header>
  {#if !data.user.isAdmin}
    <div class="identity">
      계정 {data.user.hasIdentity ? "" : "안 "}만듦
      <button onclick={copyInviteCode}>초대 코드 복사</button>
    </div>
  {/if}
  <section>
    <h2>자원</h2>
    <Tokens quantity={data.user.tokens} />
    <Chips quantity={data.user.chips} />
  </section>
  <section>
    <h2>가방</h2>
    <div class="scroll-area"></div>
  </section>
  <section>
    <h2>우편</h2>
    <div class="scroll-area">
      <MailList
        mails={data.user.mails}
        onclick={async (id) => {
          const res = await api().mail.id.get({ id });
          if (!res.ok) {
            sendError(res.error.message);
          } else {
            mail = res.data.mail;
            console.log(mail);
          }
        }}
      />
    </div>
  </section>
</main>

{#if mail}
  <Dialog onclose={() => (mail = undefined)}>
    {@const createdAt = new Date(mail.createdAt)}
    <Mail {...mail} {createdAt} />
  </Dialog>
{/if}

<style lang="scss">
  main {
    display: grid;
    padding: 0 1rem;
    gap: 1rem;
    justify-content: start;
  }
  address {
    font-style: unset;
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    gap: 0.25rem 0.5rem;
  }
  .scroll-area {
    height: 17.5rem;
  }
  .title {
    & h1 {
      margin-bottom: -0.5rem;
    }
  }
  .alert {
    display: grid;
    position: fixed;
    bottom: 1rem;
    left: 50%;
    width: min(90%, 20rem);
    grid-template-columns: 1fr repeat(2, max-content);
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transform: translate(-50%, 0);
    background: var(--slate-2);
    box-shadow: 0 0.25rem 0.5rem var(--slate-9);
  }
  .x-id {
    font-size: 1rem;
  }
  .identity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .memo {
    width: 100%;
  }
</style>
