<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { req } from "$lib/api/client";
  import { deepEqual } from "$lib/shared/util/deep-equal";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import { GET, POST } from "$routes/api/runners/[id]/penalties/+server";

  const addPenalty = () => {
    current = [
      ...current,
      {
        id: crypto.randomUUID(), // temp
        isBanned: false,
        reason: "",
      },
    ];
  };
  const cancel = () => {
    current = [...data];
  };
  const apply = async () => {
    isLoading = true;
    const res = await req<POST>("POST", "/api/runners/[id]/penalties", { id }, current);
    isLoading = false;
    if (res.ok) {
      console.log(res.data);
      await invalidate("admin:runners");
      onclose?.();
    } else {
      console.error(res.error);
    }
  };

  interface Props {
    id: string;
    name: string;
    onclose?: () => void;
  }

  let { id, name, onclose } = $props<Props>();

  interface Penalty {
    id: string;
    isBanned: boolean;
    reason: string | null;
  }
  let data = $state.frozen<Penalty[]>([]);
  let current = $state.frozen<Penalty[]>([]);
  let isLoading = $state(false);

  let isEdited = $derived(!deepEqual(current, data));

  $effect(() => {
    req<GET>("GET", `/api/runners/[id]/penalties`, { id }).then((res) => {
      if (res.ok) {
        console.log(res.data);
        data = [...res.data.penalties];
        current = [...res.data.penalties];
        console.log(data);
      } else {
        console.error(res);
      }
    });
  });
</script>

<Dialog
  onclose={() => {
    if (isEdited) {
      return;
    }
    onclose?.();
  }}
>
  <div class="penalty-dialog">
    <h1 class="title">{name}</h1>
    <div class="penalties">
      <button class="append" onclick={addPenalty}>+ 경고 추가</button>
      {#each current as penalty (penalty.id)}
        <button
          class="type"
          class:type--banned={penalty.isBanned}
          onclick={() => {
            current = current.map((p) =>
              p.id !== penalty.id ? p : { ...p, isBanned: !p.isBanned },
            );
          }}
        >
          {penalty.isBanned ? "제명" : "경고"}
        </button>
        <input
          class="reason"
          value={penalty.reason}
          oninput={(e) => {
            current = current.map((p) =>
              p.id !== penalty.id ? p : { ...p, reason: e.currentTarget.value },
            );
          }}
        />
        <button
          class="red"
          onclick={() => {
            current = current.filter((p) => p.id !== penalty.id);
          }}>삭제</button
        >
      {/each}
    </div>
    <button class="cancel" onclick={cancel} disabled={!isEdited}>재설정</button>
    <button class="apply blue emphasis" onclick={apply} disabled={!isEdited}>적용</button>
  </div>
</Dialog>

<style lang="scss">
  .penalty-dialog {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 0.5rem;
    min-height: 15rem;
  }
  .title {
    grid-column: 1 / 3;
  }
  .type {
    background: var(--yellow-9);
    color: var(--yellow-12);
    padding: 0 0.25rem;
    border-radius: 0.25rem;
    &--banned {
      background: var(--red-9);
      color: var(--red-1);
    }
  }
  .penalties {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-column: 1 / 3;
    gap: 0.5rem;
    align-items: center;
    align-self: self-start;
  }
  .append {
    grid-column: 1 / 4;
  }
</style>
