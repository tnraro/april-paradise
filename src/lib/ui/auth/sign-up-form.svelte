<script lang="ts">
  import { ID, PASSWORD } from "$lib/shared/schema/auth";

  interface Props {
    id?: string;
    name?: string;
    error?: string;
  }
  let { id, name, error }: Props = $props();
  let current = $state({
    id: id ?? "",
    name: name ?? "",
    password: "",
  });
  let errors = $state<Record<"id" | "name" | "password", string | null>>({
    id: null,
    name: null,
    password: null,
  });
  $effect(() => {
    if (current.id.length > 0) {
      const res = ID.safeParse(current.id);
      if (res.success) {
        current.id = res.data;
        errors.id = null;
      } else {
        errors.id = res.error.errors.map((e) => e.message).join("\n");
      }
    }
  });
  $effect(() => {
    if (current.password.length > 0) {
      const res = PASSWORD.safeParse(current.password);
      if (res.success) {
        current.password = res.data;
        errors.password = null;
      } else {
        errors.password = res.error.errors.map((e) => e.message).join("\n");
      }
    }
  });
</script>

<form method="post">
  <label for="id">아이디</label>
  <input
    id="id"
    name="id"
    bind:value={current.id}
    autocomplete="username"
    placeholder="아이디"
    minlength="2"
    maxlength="53"
    required
  />
  {#if errors.id}
    <div class="error">{errors.id}</div>
  {/if}
  <label for="password">비밀번호</label>
  <input
    type="password"
    id="password"
    name="password"
    bind:value={current.password}
    autocomplete="new-password"
    placeholder="비밀번호"
    minlength="8"
    required
  />
  {#if errors.password}
    <div class="error">{errors.password}</div>
  {/if}
  <label for="name">이름</label>
  <input
    id="name"
    name="name"
    bind:value={current.name}
    autocomplete="nickname"
    placeholder="이름"
    required
  />
  {#if error}
    <div class="error">{error}</div>
  {/if}
  <button class="blue emphasis">가입</button>
</form>

<style lang="scss">
  form {
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
