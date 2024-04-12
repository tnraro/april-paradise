<script lang="ts">
  import { sendError } from "../error/send-error";
  import Dialog from "../floating/dialog.svelte";
  import AnimatingText from "../text/animating-text.svelte";

  interface Props {
    key: string;
    title: string | null;
    npc: string | null;
    script: string;
    next: string[] | null;
    triggerType: string | null;
    back: string | null;
    onnext?: (value: string) => void;
    ontrigger?: (type: string, value: string) => void;
  }
  let {
    key,
    title,
    npc,
    script,
    next,
    triggerType,
    back,
    onnext,
    ontrigger,
  }: Props = $props();

  let done = $state(false);
  let open = $state(false);

  let single = $derived(next != null && next.length === 1);
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
    {#if back}
      <button onclick={() => onnext?.(back!)}>뒤로</button>
    {/if}
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
        {#each next as key}
          {#if triggerType}
            <button
              class="option"
              onclick={() => {
                if (triggerType != null) {
                  ontrigger?.(triggerType, `${triggerType}-${title}-${key}`);
                }
              }}>
              <span>{key}</span>
              <span>{triggerType}</span>
            </button>
          {:else}
          <button
            class="option"
            onclick={() => {
              onnext?.(key);
            }}>{key}</button>
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