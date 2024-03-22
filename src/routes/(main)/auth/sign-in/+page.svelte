<script lang="ts">
import type { ActionData } from "./$types";
interface Props {
  form: ActionData;
}
let { form } = $props<Props>();
</script>

<form class="_" method="post">
  <h1>로그인</h1>
  <label for="id">아이디</label>
  <input id="id" name="id" value={form?.id ?? ""} autocomplete="username" />
  <label for="password">비밀번호</label>
  <input type="password" id="password" name="password" autocomplete="current-password" />
  <button class="blue emphasis">로그인</button>
  {#if form != null}
    <div class="error">아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.</div>
  {/if}
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
