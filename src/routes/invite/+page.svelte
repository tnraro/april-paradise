<script lang="ts">
  import { josa2 } from "$lib/shared/util/josa";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import { Control, Field, FieldErrors, Label } from "formsnap";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { schema } from "./schema";
  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(schema),
  });
  const { form: formData, enhance } = form;

  let isOpen = $state(false);
  let isNotMe = $state(false);
  $effect(() => {
    isOpen = true;
  });
</script>

<main>
  {#if !isOpen && !isNotMe}
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
  {/if}
</main>

{#if isOpen}
  <Dialog>
    <div class="dialog">
      <div class="dialog__header">
        <p>커뮤에 초대되셨어요</p>
        <h1>4월의 낙원호</h1>
      </div>
      <div>
        <p>{data.runner.name} 님 안녕하세요!🖐️</p>
        <p>여기선 커뮤를 진행하는 동안 다양한 즐길거리와 이벤트를 제공해요.</p>
      </div>
      <div class="dialog__footer">
        <button
          class="blue emphasis dialog__button"
          onclick={() => {
            isOpen = false;
          }}>확인했어요</button
        >
        <button
          class="red dialog__button"
          onclick={() => {
            isOpen = false;
            isNotMe = true;
          }}>저는 {josa2(data.runner.name, "이", "가")} 아닌데요...</button
        >
      </div>
    </div>
  </Dialog>
{/if}
{#if isNotMe}
  <Dialog>
    <div class="dialog">
      <div class="dialog__header">
        <h1>이런!</h1>
      </div>
      <div>
        <p>뭔가 착오가 있었나봐요 🙏</p>
        <p>운영에 DM 해주세요!</p>
      </div>
    </div>
  </Dialog>
{/if}

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
    }
  }
</style>
