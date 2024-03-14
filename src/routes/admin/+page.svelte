<script lang="ts">
  import { getRoom } from "$lib/liveblocks/client";
  import { onDestroy, onMount } from "svelte";

  let disposes: (() => void)[] = [];

  onMount(async () => {
    const { room, leave } = getRoom("test");
    disposes.push(leave);

    console.log(room.getStatus());
    console.log((await room.getStorage()).root.toImmutable());
  });

  onDestroy(() => {
    disposes.forEach((dispose) => dispose());
  });
</script>

<div>432432</div>
