<script lang="ts">
  import { useRoom } from "$lib/liveblocks/room.svelte";
  import FocusedElement from "$lib/ui/focused-element.svelte";
  import StatusBar from "$lib/ui/status-bar.svelte";
  import UserList from "$lib/ui/user-list.svelte";

  useRoom("test");
</script>

<div class="h-[100dvh]">
  <UserList />
  <StatusBar />
</div>

<FocusedElement />
