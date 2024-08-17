<script>
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
  <h1>운영진으로 가입</h1>
  <Field {form} name="userId">
    <Control let:attrs>
      <Label>아이디</Label>
      <input
        {...attrs}
        bind:value={$formData.userId}
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
        autocomplete="new-password"
        placeholder="비밀번호를 입력해주세요"
        minlength="8"
        required
      />
    </Control>
    <FieldErrors />
  </Field>
  <Field {form} name="name">
    <Control let:attrs>
      <Label>이름</Label>
      <input
        {...attrs}
        bind:value={$formData.name}
        autocomplete="nickname"
        placeholder="이름을 입력해주세요"
        required
      />
    </Control>
    <FieldErrors />
  </Field>
  <button class="blue emphasis">참가하기</button>
  <a href="/auth/sign-in">로그인</a>
</form>

<style lang="scss">
  ._ {
    display: grid;
    gap: 0.5rem;
  }
</style>
