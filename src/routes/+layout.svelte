<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { env } from "$env/dynamic/public"
  import "$lib/ui/styles/index.scss";
  import * as Sentry from "@sentry/browser";
  import { onMount } from "svelte";

  onMount(() => {
    Sentry.init({
      dsn: env.PUBLIC_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      environment: import.meta.env.PROD ? "production" : "development",
      // Performance Monitoring
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    });
  });

  let { children, data } = $props();

  let t: number;
  const update = async () => {
    clearTimeout(t);
    await invalidateAll();
    t = setTimeout(update, 60000) as unknown as number;
  };
</script>

{#if data.notices.length > 0}
  <div class="notices">
    {#each data.notices as notice}
      <!-- svelte-ignore a11y_distracting_elements -->
      <marquee>{notice.text}</marquee>
    {/each}
  </div>
{/if}
{@render children()}

<svelte:window onfocus={update} onblur={() => clearTimeout(t)} />

<style>
  .notices {
    display: grid;
    position: fixed;
    bottom: 0;
    width: 100%;
    background: var(--yellow-3);
  }
</style>