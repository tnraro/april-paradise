<script lang="ts">
  import { goto } from "$app/navigation";
  import MailList from "$lib/ui/mail/mail-list.svelte";

  let { data, children } = $props();
</script>

<div class="_">
  <section>
    <h1>우편함</h1>
    <MailList
      mails={data.mails}
      onclick={(id) => {
        goto(`/mails/${id}`);
      }}
    />
  </section>
  {@render children()}
</div>

<style lang="scss">
  ._ {
    margin: 0 auto;
    min-width: min(20rem, 90vw);
    display: flex;
    justify-content: center;
    height: 100%;
    position: relative;
  }
  section {
    width: min(20rem, 90vw);
    overflow-y: auto;
    max-height: 100%;
    padding: 1rem;
  }
  @media screen and (max-width: 40rem) {
    section {
      width: 100vw;
    }
  }
</style>