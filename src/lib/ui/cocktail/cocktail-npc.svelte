<script lang="ts">
  import AnimatingText from "../text/animating-text.svelte";

  interface Props {
    npc: string;
    script: string;
    onclick?: () => void;
  }
  let { npc, script, onclick }: Props = $props();

  let done = $state(false);
</script>

<h2>{npc}</h2>
<AnimatingText text={script} {done} ondone={() => (done = true)} />
{#if done}
  <button {onclick}>닫기</button>
{:else}
  <button onclick={() => (done = true)}>건너뛰기</button>
{/if}
