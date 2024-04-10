<script lang="ts">
  import { env } from "$env/dynamic/public";
</script>

<main>
  <p>문제가 발생했나요? <a href="{env.PUBLIC_FORM_URL}" target="_blank" rel="noreferrer">구글 폼</a>으로 전달해주세요!</p>
</main>

<style lang="scss">
  main {
    width: 20rem;
    margin: 5rem auto;
  }
</style>