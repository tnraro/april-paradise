<script lang="ts">
  import Dialog from "../floating/dialog.svelte";
  import AnimatingText from "../text/animating-text.svelte";
    import CocktailTrigger from "./cocktail-trigger.svelte";

  const enum State {
    Idle,
    Pending,
  }

  interface Props {
    key: string;
    title: string | null;
    npc: string | null;
    script: string;
    next: string[] | null;
    triggerType: string | null;
    back: string | null;
    visiteds: {
      type: string;
      title: string;
      key: string;
    }[];
    onnext?: (value: string) => void;
    ontrigger?: (type: string, value: string) => void | Promise<void>;
  }
  let {
    key,
    title,
    npc,
    script,
    next,
    triggerType,
    back,
    visiteds,
    onnext,
    ontrigger,
  }: Props = $props();

  let done = $state(false);
  let open = $state(false);

  let single = $derived(next != null && next.length === 1);

  let s = $state<State>(State.Idle);

  let preferredType = $derived(visiteds.at(0)?.type);
  let visitedSet = $derived(new Set(visiteds.map(x => `${x.title}-${x.key}`)));
</script>

<div class="cocktail">
  <header>
    {#if title}
      <h1>{title}</h1>
    {/if}
  </header>
  <section class="content">
    {#if npc}
      <h2>{npc}</h2>
    {/if}
    <AnimatingText
      text={script}
      {done}
      ondone={() => {
        done = true;
      }}
    />
  </section>
  <footer>
    <button disabled={!back} onclick={() => onnext?.(back!)}>뒤로</button>
    {#if done}
      {#if next}
        <button
          class="emphasis"
          onclick={() => {
            if (next != null) {
              if (single) {
                onnext?.(next[0]);
              } else {
                open = true;
              }
            }
          }}>{single ? "다음" : "선택"}</button
        >
      {/if}
    {:else}
      <button onclick={() => (done = true)}>건너뛰기</button>
    {/if}
  </footer>
</div>

{#if open}
  <Dialog onclose={() => (open = false)}>
    <div class="select">
      {#if next}
        {#each next as k}
          {#if triggerType}
            <CocktailTrigger
              title="{title}-{k}"
              {triggerType}
              disabled={s === State.Pending}
              done={visitedSet.has(`${title}-${k}`)}
              onclick={async () => {
                s = State.Pending;
                await ontrigger?.(triggerType!, `${triggerType}-${title}-${k}`);
              }}
              ondone={() => {
                s = State.Idle;
              }}
            />
          {:else}
            <button
              class="option"
              disabled={key === "1" && (preferredType == null ? false : k.slice(0, 2) !== preferredType)}
              onclick={() => {
                onnext?.(k);
              }}>{k}</button>
          {/if}
        {/each}
      {/if}
    </div>
  </Dialog>
{/if}

<style>
  .cocktail {
    width: min(20rem, 100vw);
    display: grid;
    grid-template-rows: 40px 1fr max-content;
    gap: 1rem;
    height: 100%;
  }
  .content {
    border: 1px solid var(--slate-6);
    min-height: 10rem;
    border-radius: 1rem;
    padding: 1rem;
    word-break: keep-all;
  }
  footer {
    display: flex;
    gap: 1rem;
    & > button {
      width: 100%;
    }
  }
  .select {
    display: grid;
    gap: 0.5rem;
  }
  .option {
    justify-content: space-between;
  }
</style>
