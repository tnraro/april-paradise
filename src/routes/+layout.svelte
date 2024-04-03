<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import "$lib/ui/styles/index.scss";
  let { children } = $props();

  let t: number;
  const update = async () => {
    clearTimeout(t);
    await invalidateAll();
    t = setTimeout(update, 60000) as unknown as number;
  }
</script>

{@render children()}

<svelte:window onfocus={update} onblur={() => clearTimeout(t)} />