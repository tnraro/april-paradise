<script lang="ts">
  import { useStatus } from "$lib/liveblocks/room.svelte";

  const status = useStatus("test");

  let isStatusBad = $derived(status.value === "연결 끊김");
  let isStatusWarning = $derived(
    status.value === "연결중" || status.value === "재연결 시도중" || status.value === "대기중",
  );
  let isStatusGood = $derived(status.value === "연결됨");
</script>

<div class="grid grid-cols-[1fr] fixed bottom-0 border-t border-t-slate-300 w-[100%] bg-slate-100">
  <span
    class="select-none"
    class:text-red-600={isStatusBad}
    class:text-yellow-600={isStatusWarning}
    class:text-green-600={isStatusGood}>{status.value}</span
  >
</div>
