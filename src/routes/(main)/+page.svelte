<script lang="ts">
  import type { PageData } from "./$types";

  const i = Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "narrow",
    hour12: true,
    dayPeriod: "long",
    hour: "numeric",
    minute: "numeric",
  });
  const formatRange = (start: Date, end: Date) => i.formatRange(start, end);

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();
</script>

<main class="_">
  <section>
    <h1>이벤트</h1>
    <div class="events">
      {#each data.schedule as event (event.key)}
        <a class="event" href={event.pathname}>
          <h2 class="event__title">{event.title}</h2>
          <p class="event__description">{event.description}</p>
          <div class="event__duration">
            {formatRange(event.start, event.end)}
          </div>
        </a>
      {/each}
    </div>
  </section>
</main>

<style lang="scss">
  ._ {
    display: grid;
    gap: 2rem;
    place-items: center;
  }
  .events {
    display: grid;
  }
  .event {
    display: grid;
    text-decoration: none;
    justify-items: start;
    gap: 0.25rem;
    padding: 1rem 0;
    border-radius: 0.25rem;
    width: min(25rem, 100vw);
    &:not(:last-child) {
      border-bottom: 1px solid var(--slate-6);
    }

    &__title {
    }
    &__description {
      color: var(--slate-11);
      text-overflow: ellipsis;
      overflow: hidden;
      text-wrap: nowrap;
      max-width: 100%;
    }
    &__duration {
      padding: 0 0.25rem;
      border-radius: 0.25rem;
      background: var(--amber-3);
      color: var(--amber-12);
      word-break: keep-all;
      &::before {
        content: "🕜";
      }
    }
  }
</style>
