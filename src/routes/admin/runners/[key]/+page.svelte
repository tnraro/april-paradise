<script lang="ts">
  import { api } from "$lib/api/api.gen.js";
  import { useItemData } from "$lib/ui/data/data.svelte";
  import { sendError } from "$lib/ui/error/send-error.js";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import InventoryItem from "$lib/ui/inventory/inventory-item.svelte";
  import Inventory from "$lib/ui/inventory/inventory.svelte";
  import Chips from "$lib/ui/item/chips.svelte";
  import Tokens from "$lib/ui/item/tokens.svelte";
  import MailList from "$lib/ui/mail/mail-list.svelte";
  import Mail from "$lib/ui/mail/mail.svelte";
  import SendMail from "$lib/ui/mail/send-mail.svelte";

  let { data } = $props();

  const itemData = useItemData();

  let itemMap = $derived(new Map(itemData.data?.map((x) => [x.key, x]) ?? []));

  let mail = $state<{
    id: string;
    sender: string;
    title: string;
    body: string;
    rewards: string;
    isReceived: boolean;
    createdAt: Date;
  } | null>();

  let isMailEdit = $state(false);

  let message = $state<string>();
</script>

<main>
  <header class="title">
    <h1>{data.user.name}</h1>
  </header>
  <section>
    <h2>자원</h2>
    <Tokens quantity={data.user.tokens} />
    <Chips quantity={data.user.chips} />
  </section>
  <section>
    <h2>가방</h2>
    <div class="scroll-area inventory">
      {#if data.user.inventory.length > 0}
        {#each data.user.inventory as inventory}
          <h3>{inventory.category}</h3>
          <Inventory>
            {#each inventory.items as item (item.key)}
              {@const i = itemMap.get(item.key)}
              <InventoryItem
                key={item.key}
                name={i?.name}
                quantity={item.quantity}
              >
                {i?.description}
              </InventoryItem>
            {/each}
          </Inventory>
        {/each}
      {:else}
        비어있습니다.
      {/if}
    </div>
  </section>
  <section>
    <h2>우편</h2>
    <button onclick={() => (isMailEdit = true)}>새 우편 작성</button>
    <div class="scroll-area">
      {#if data.user.mails.length > 0}
        <MailList
          mails={data.user.mails}
          onclick={async (id) => {
            const res = await api().mail.id.get({ id });
            if (!res.ok) {
              sendError(res.error.message);
            } else {
              mail = res.data.mail;
            }
          }}
        />
      {:else}
        비어있습니다.
      {/if}
    </div>
  </section>
</main>

{#if mail}
  <Dialog onclose={() => (mail = undefined)}>
    {@const createdAt = new Date(mail.createdAt)}
    <Mail {...mail} {createdAt} />
  </Dialog>
{/if}

{#if isMailEdit}
  <Dialog>
    <SendMail
      items={data.itemData}
      onclose={() => (isMailEdit = false)}
      onsubmit={async (d) => {
        const res = await api().mail.post({
          ...d,
          recipients: [data.user.id],
        });
        if (!res.ok) {
          sendError(res.error.message);
        }
      }}
    />
  </Dialog>
{/if}

{#if message}
  <Dialog onclose={() => (message = undefined)}>
    {message}
    <button onclick={() => (message = undefined)}>닫기</button>
  </Dialog>
{/if}

<style lang="scss">
  main {
    display: grid;
    padding: 0 1rem;
    gap: 1rem;
  }
  .scroll-area {
    height: 17.5rem;
  }
  .title {
    & h1 {
      margin-bottom: -0.5rem;
    }
  }
  .inventory {
    min-width: min(32rem, 100%);
  }
</style>
