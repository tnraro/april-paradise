<script>
  import SignUpForm from "$lib/ui/auth/sign-up-form.svelte";

  let { form } = $props();
</script>

<div class="_">
  <h1>운영진으로 가입</h1>
  <SignUpForm id={form?.id} name={form?.name} error={form?.error} />
  <a href="/auth/sign-in">로그인</a>
</div>

<style lang="scss">
  ._ {
    display: grid;
    gap: 1rem;
    padding: 1rem;
  }
</style>
