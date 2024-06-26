<script lang="ts">
  import { env } from "$env/dynamic/public";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import { Control, Field, FieldErrors, Label } from "formsnap";
  import { onMount } from "svelte";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { schema } from "./schema";
  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(schema),
  });
  const { form: formData, enhance } = form;

  const enum State {
    Idle,
    Notice,
    SignUpForm,
    NotMe,
  }

  let s = $state<State>(State.Idle);

  onMount(() => {
    s = State.Notice;
  });
</script>

{#if s === State.Idle}
  <div class="_">
    <enhanced:img alt="" src="$img/logo.png?enhanced&w=320" />
  </div>
{:else if s === State.Notice}
  <Dialog>
    <div class="dialog">
      <div class="dialog__header">
        <p>카락실에 오신 것을 환영합니다</p>
        <h1>4월의 낙원호</h1>
      </div>
      <div>
        <p><b>{data.runner.name}</b> 님 어서오세요! 🖐️</p>
        <p>
          <a href={env.PUBLIC_DOCS_URL} target="_blank" rel="noreferrer"
            >시스템 문서</a
          >를 제대로 숙지하였다면 입장을 도와드리겠습니다.
        </p>
      </div>
      <div class="dialog__footer">
        <button
          class="blue emphasis dialog__button"
          onclick={() => {
            s = State.SignUpForm;
          }}>숙지했어요</button
        >
        <button
          class="red dialog__button"
          onclick={() => {
            s = State.NotMe;
          }}>{data.runner.name} 님이 아닐 경우 여기를 눌러주세요</button
        >
      </div>
    </div>
  </Dialog>
{:else if s === State.SignUpForm}
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
      <input type="hidden" name="code" value={$formData.code} />
      <button class="blue emphasis">참가하기</button>
      {#if form != null}{/if}
    </form>
  </div>
{:else if s === State.NotMe}
  <Dialog>
    <div class="dialog">
      <div class="dialog__header">
        <h1>이런!</h1>
      </div>
      <div>
        <p>뭔가 착오가 있었나봐요 🙏</p>
        <p>총괄에게 문의 부탁드립니다</p>
      </div>
    </div>
  </Dialog>
{/if}

<style lang="scss">
  ._ {
    width: min(20rem, 90%);
    margin: 0 auto;
    padding: 1rem;
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
  .dialog {
    display: grid;
    gap: 1rem;
    text-align: center;

    &__button {
      justify-content: center;
    }

    &__footer {
      display: grid;
      gap: 0.25rem;
    }
    p {
      word-break: keep-all;
      text-wrap: balance;
    }
  }
</style>
