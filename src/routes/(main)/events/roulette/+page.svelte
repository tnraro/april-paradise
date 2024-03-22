<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { api } from "$lib/api/api.gen";
  import Roulette from "$lib/ui/roulette/roulette.svelte";

  let { data } = $props();
</script>

<main>
  <div class="machine">
    <Roulette
      bind:tokens={data.user!.tokens}
      table={data.rouletteData}
      onreward={() => {
        invalidate(`header:${data.user?.name}`);
      }}
      onroll={async () => {
        const res = await api().events.roulette.post(undefined);
        if (res.ok) return res.data;
        else throw res.error;
      }}
    />
  </div>
</main>

<style>
  main {
    display: grid;
    place-items: center;
    background: linear-gradient(0deg, white, var(--sand-6) 30%, var(--sand-8) 35%, white);
    padding: 5rem 0;
  }
  .machine {
    width: 25rem;
  }
</style>
