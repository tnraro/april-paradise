<script>
  import Mail from "$lib/ui/mail/mail.svelte";

  let { data } = $props();
</script>

<Mail {...data.mail} />
