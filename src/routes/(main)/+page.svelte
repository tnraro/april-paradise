<script lang="ts">
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }
  let { data } = $props<Props>();
</script>

<div>일정</div>

{#if data.isSignedIn}
  <a href="/auth/sign-out">sign-out</a>
{:else}
  <a href="/auth/sign-in">sign-in</a>
  <a href="/auth/sign-up">sign-up (admin)</a>
{/if}
