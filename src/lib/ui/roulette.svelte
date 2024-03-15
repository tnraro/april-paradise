<script lang="ts">
  interface Props {
    data: readonly string[];
    isRolling: boolean;
    result: string | undefined;
  }
  let { data, isRolling, result } = $props<Props>();

  let index = $state(0);
  let prev = $derived(data[(index - 1) % data.length]);
  let current = $derived(data[index % data.length]);
  let next = $derived(data[(index + 1) % data.length]);
  let steps = 10;
</script>

<div class="h-6 overflow-hidden text-center w-28 relative">
  {#if isRolling}
    <div
      class="absolute w-full -top-6 animate-roll"
      style="color: hsla(0deg 0% 0% / {1 / steps})"
      onanimationiteration={() => (index += 1)}
    >
      <div class="relative h-6">
        {#each { length: steps } as _, i}
          <div class="absolute w-full" style="top: {(steps * (i - 0.5)) / steps}px">
            {prev}
          </div>
        {/each}
      </div>
      <div class="relative h-6">
        {#each { length: steps } as _, i}
          <div class="absolute w-full" style="top: {(steps * (i - 0.5)) / steps}px">
            {current}
          </div>
        {/each}
      </div>
      <div class="relative h-6">
        {#each { length: steps } as _, i}
          <div class="absolute w-full" style="top: {(steps * (i - 0.5)) / steps}px">
            {next}
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div>{result}</div>
  {/if}
</div>
