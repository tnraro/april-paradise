<script lang="ts">
  import { newRunner, type Runner } from "$lib/liveblocks/model";
  import { useRunners } from "$lib/liveblocks/room.svelte";
  import { batch } from "$lib/liveblocks/utils";
  import { delay } from "$lib/shared/delay";

  const makeUpdate = (index: number, patch: Partial<Runner>) => {
    const update = updates.get(index) ?? {};
    updates.set(index, {
      ...update,
      ...patch,
    });
    delay(500).then(() => {
      if (updates.size === 0) return;
      const _runners = runners.mut();
      if (_runners == null) return;
      batch("test", () => {
        updates.forEach((update, index) => {
          const runner = _runners.get(index);
          if (runner == null) return;
          for (const key of Object.keys(update) as (keyof Runner)[]) {
            runner.set(key, update[key]!);
          }
        });
        updates.clear();
      });
    });
  };
  const updates = new Map<number, Partial<Runner>>();
  let runners = useRunners("test");

  $inspect(runners.value);
  $inspect(runners.value?.[0].chips);

  let isEditing = $state(false);
</script>

<button
  class="btn-primary"
  onclick={() => {
    isEditing = !isEditing;
  }}>{isEditing ? "편집 종료" : "편집"}</button
>
<div class="grid grid-cols-[8rem_5rem_5rem_2rem] gap-2 p-[1px]">
  <div class="font-bold">이름</div>
  <div class="font-bold">칩</div>
  <div class="font-bold">토큰</div>
  <div class="font-bold">ID</div>
  {#if runners.value}
    {#each runners.value as runner, i (runner.id)}
      {#if isEditing}
        <input
          data-id="runner_{runner.id}_name"
          type="text"
          value={runner.name}
          oninput={async (e) => {
            makeUpdate(i, { name: e.currentTarget.value });
          }}
        />
        <input
          data-id="runner_{runner.id}_chips"
          type="number"
          value={runner.chips}
          min={0}
          oninput={async (e) => {
            makeUpdate(i, { chips: Number(e.currentTarget.value) });
          }}
        />
        <input
          data-id="runner_{runner.id}_tokens"
          type="number"
          value={runner.tokens}
          min={0}
          oninput={async (e) => {
            makeUpdate(i, { tokens: Number(e.currentTarget.value) });
          }}
        />
        <div class="whitespace-nowrap overflow-hidden select-all text-ellipsis" data-id="runner_{runner.id}_id">{runner.id}</div>
      {:else}
        <div data-id="runner_{runner.id}_name">{runner.name}</div>
        <div data-id="runner_{runner.id}_chips">{runner.chips}</div>
        <div data-id="runner_{runner.id}_tokens">{runner.tokens}</div>
        <div class="whitespace-nowrap overflow-hidden select-all text-ellipsis" data-id="runner_{runner.id}_id">{runner.id}</div>
      {/if}
    {/each}
    {#if isEditing}
      <button
        class="btn-primary"
        disabled={runners.value == null}
        onclick={() => {
          runners.mut().push(newRunner());
        }}>+ 추가</button
      >
    {/if}
  {:else}
    로딩중...
  {/if}
</div>
