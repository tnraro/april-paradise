<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="error">
  <p>
    {$page.status}
    {$page.error?.message}
  </p>
  <a href="/report">오류 보고하기</a>
</div>

<style lang="scss"></style>
