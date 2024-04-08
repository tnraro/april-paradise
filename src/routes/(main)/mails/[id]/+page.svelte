<script>
  import { goto, invalidateAll } from "$app/navigation";
  import { api } from "$lib/api/api.gen";
  import { sendError } from "$lib/ui/error/send-error";
  import Mail from "$lib/ui/mail/mail.svelte";

  let { data } = $props();

  let isLoading = $state(false);
</script>

<main>
  <Mail
    {...data.mail}
    onclick={async () => {
      isLoading = true;
      const res = await api().mail.id.put({ id: data.mail.id }, undefined);
      isLoading = false;
      if (!res.ok) {
        sendError(res.error.message);
      } else {
        await invalidateAll();
      }
    }}
  />
  <button onclick={() => goto("/mails")}>닫기</button>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: min(20rem, 90vw);
    overflow-y: auto;
    height: 100%;
    padding: 1rem;
  }
  @media screen and (max-width: 40rem) {
    main {
      background: white;
      position: absolute;
      box-shadow: var(--height-4);
      border-top-left-radius: 1rem;
      border-bottom-left-radius: 1rem;
      max-height: 100%;
      right: 0;
    }
  }
</style>
