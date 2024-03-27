<script lang="ts">
  import { Control, Field, FieldErrors, Label } from "formsnap";
  import SuperDebug, { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { schema } from "./schema";
  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(schema),
  });
  const { form: formData, enhance } = form;
</script>

<div class="_">
  <form method="post" use:enhance>
    <h1>{data.runner.name} 님 환영합니다!</h1>
    <Field {form} name="id">
      <Control let:attrs>
        <Label>아이디</Label>
        <input {...attrs} bind:value={$formData.id} autocomplete="username" />
      </Control>
      <FieldErrors />
    </Field>
    <Field {form} name="password">
      <Control let:attrs>
        <Label>비밀번호</Label>
        <input
          {...attrs}
          bind:value={$formData.password}
          type="password"
          autocomplete="new-password"
        />
      </Control>
      <FieldErrors />
    </Field>
    <input type="hidden" name="code" value={$formData.code} />
    <button class="blue emphasis">가입</button>
    {#if form != null}{/if}
  </form>
</div>
<SuperDebug data={$formData} />

<style lang="scss">
  ._ {
    max-width: 30rem;
    margin: 0 auto;
  }
  form {
    display: grid;
    align-items: end;
    gap: 0.5rem;
  }
  .error {
    color: var(--red-11);
    word-break: keep-all;
  }
</style>
