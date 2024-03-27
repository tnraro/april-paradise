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

<main>
  <div class="_">
    <form method="post" use:enhance>
      <h1>4월의 낙원호</h1>
      <p class="description">커뮤를 뛰는 동안 사용할 계정을 만들어주세요</p>
      <Field {form} name="id">
        <Control let:attrs>
          <Label>아이디</Label>
          <input
            {...attrs}
            bind:value={$formData.id}
            autocomplete="username"
            placeholder="아이디를 입력해주세요"
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
          />
        </Control>
        <FieldErrors />
      </Field>
      <input type="hidden" name="code" value={$formData.code} />
      <button class="blue emphasis">참가하기</button>
      {#if form != null}{/if}
    </form>
  </div>
</main>

<style lang="scss">
  main {
    display: grid;
    align-items: center;
    height: 100dvh;
  }
  ._ {
    width: min(20rem, 90%);
    margin: 0 auto;
  }
  .description {
    color: var(--slate-11);
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
