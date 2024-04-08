<script lang="ts">
  import { goto } from "$app/navigation";
  import MailList from "$lib/ui/mail/mail-list.svelte";

  let { data, children } = $props();
</script>

<div class="_">
  <section class="section">
    <h1>우편함</h1>
    <MailList
      mails={data.mails}
      onclick={(id) => {
        goto(`/mails/${id}`);
      }}
    />
  </section>
  <main class="section">
    {@render children()}
  </main>
</div>

<style lang="scss">
  ._ {
    margin: 0 auto;
    min-width: min(20rem, 90vw);
    display: flex;
    justify-content: center;
  }
  .section {
    width: min(20rem, 90vw);
  }
</style>