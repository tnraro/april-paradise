<script lang="ts">
  import { Control, Field, FieldErrors, Label } from "formsnap";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { schema } from "./schema";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(schema),
  });
  const { form: formData, enhance } = form;
</script>

<form class="_" method="post" use:enhance>
  <h1>로그인</h1>
  <Field {form} name="id">
    <Control let:attrs>
      <Label>아이디</Label>
      <input
        {...attrs}
        bind:value={$formData.id}
        autocomplete="username"
        placeholder="아이디를 입력해주세요"
        minlength="2"
        maxlength="53"
        required
      />
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
        autocomplete="current-password"
        placeholder="비밀번호를 입력해주세요"
        minlength="8"
        required
      />
    </Control>
    <FieldErrors />
  </Field>
  <button class="blue emphasis">로그인</button>
</form>

<style lang="scss">
  ._ {
    display: grid;
    align-items: end;
    gap: 0.5rem;
  }
  label {
    margin-bottom: -0.5rem;
  }
  .error {
    color: var(--red-11);
    word-break: keep-all;
  }
</style>
