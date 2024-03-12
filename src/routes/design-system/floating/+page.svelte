<script lang="ts">
  import Alert from "$lib/ui/floating/alert.svelte";
  import Dialog from "$lib/ui/floating/dialog.svelte";

  let showAlert = $state(false);
  let showDialog = $state(false);
</script>

<div class="grid">
  <div>그림자</div>
  <div class="elements">
    <div class="height-1">높이 1</div>
    <div class="height-2">높이 2</div>
    <div class="height-3">높이 3</div>
    <div class="height-4">높이 4</div>
  </div>
  <div>컴포넌트</div>
  <div class="elements">
    <button onclick={() => (showAlert = true)}>경고</button>
    <button onclick={() => (showDialog = true)}>대화상자</button>
  </div>
</div>

{#if showAlert}
  <Alert>
    <span>ㅎㅇ</span>
    <button onclick={() => (showAlert = false)}>닫기</button>
  </Alert>
{/if}
{#if showDialog}
  <Dialog onclose={() => (showDialog = false)}>
    <div class="dialog">
      <input />
      <input />
      <input />
      <button onclick={() => (showDialog = false)}>닫기</button>
    </div>
  </Dialog>
{/if}

<style lang="scss">
  @use "sass:math";
  .elements {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
  }
  @for $i from 1 through 4 {
    .height-#{$i} {
      box-shadow: var(--height-#{$i});
      z-index: $i;
      background: white;
      aspect-ratio: 1/1;
      display: grid;
      place-items: center;
    }
  }
  .dialog {
    display: grid;
    gap: 1rem;
  }
</style>
