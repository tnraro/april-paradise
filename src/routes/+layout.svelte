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
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      environment: import.meta.env.PROD ? "production" : "development",
      // Performance Monitoring
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  });

  let { children } = $props();

  let t: number;
  const update = async () => {
    clearTimeout(t);
    await invalidateAll();
    t = setTimeout(update, 60000) as unknown as number;
  };
</script>

{@render children()}

<svelte:window onfocus={update} onblur={() => clearTimeout(t)} />
