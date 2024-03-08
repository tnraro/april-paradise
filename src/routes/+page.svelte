<script lang="ts">
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }
  let { data } = $props<Props>();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if data.isSignedIn}
  <a href="/auth/sign-out">sign-out</a>
{:else}
  <a href="/auth/sign-in">sign-in</a>
  <a href="/auth/sign-up">sign-up</a>
{/if}
