<script lang="ts">
    import { onDestroy } from "svelte";

  interface Props {
    text: string;
    done?: boolean;
    characterDelay?: number;
    lineDelay?: number;
    ondone?: () => void;
  }
  let {
    text,
    done = false,
    characterDelay = 50,
    lineDelay = 600,
    ondone,
  }: Props = $props();

  let t: number;

  let lines = $derived.by(() => {
    clearTimeout(t);
    let delay = 0;
    const lines = text.split(/\s*\n\s*/).map((x) => {
      const line = [...x].map((char) => {
        delay += characterDelay;
        return {
          char,
          delay,
        };
      });
      delay += lineDelay;
      return line;
    });
    if (ondone) t = setTimeout(ondone, delay) as unknown as number;

    return lines;
  });
  onDestroy(() => {
    clearTimeout(t);
  });
</script>

<div>
  {#each lines as line}
    <p>
      {#each line as { char, delay }}
        <span class="char" class:char--done={done} style:---delay="{delay}ms"
          >{char}</span
        >
      {/each}
    </p>
  {/each}
</div>

<style lang="scss">
  .char {
    opacity: 0;
    animation: appear 100ms ease-in-out forwards;
    animation-delay: var(---delay);

    &--done {
      animation: none;
      opacity: 1;
    }
  }
  @keyframes -global-appear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
