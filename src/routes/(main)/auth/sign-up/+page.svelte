<script lang="ts">
import type { ActionData } from "./$types";
import { ErrorCode } from "./lib";
interface Props {
  form: ActionData & { code: ErrorCode };
}
let { form } = $props<Props>();
</script>

<form method="post">
  <h1>가입</h1>
  <label for="name">이름</label>
  <input id="name" name="name" value={form?.name ?? ""} autocomplete="nickname" />
  <label for="id">아이디</label>
  <input id="id" name="id" value={form?.id ?? ""} autocomplete="username" />
  <label for="password">비밀번호</label>
  <input type="password" id="password" name="password" autocomplete="new-password" />
  <div>약관 자리</div>
  <button>가입</button>
  {#if form != null}
    {#if form.code === ErrorCode.AlreadyRegistered}
      <div>이미 사용하는 아이디입니다.</div>
    {:else if form.code === ErrorCode.SessionStarted}
      <div>이미 시작된 세션입니다.</div>
    {:else}
      <div>무언가 잘못되었습니다. 나중에 다시 시도해주세요.</div>
    {/if}
  {/if}
  <a href="/auth/sign-in">로그인</a>
</form>
