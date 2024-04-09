<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { api } from '$lib/api/api.gen.js';
  import { sendError } from '$lib/ui/error/send-error.js';

  const syncRunner = async () => {
    const res = await api().runners.put(undefined);
    if (!res.ok) {
      sendError("sync failed", res.error);
    } else {
      if (res.data.updated > 0) {
        invalidate("admin:runners");
      }
    }
  }
  let { data, children } = $props();
</script>

<div class="_">
  <div class="_left">
    <button onclick={syncRunner}>러너 동기화</button>
    <div role="tablist" class="tablist">
      <a
        role="tab"
        class="tab"
        aria-selected={data.selected == null}
        aria-controls="panel"
        href="/admin/runners"
      >
        전체 보기
      </a>
      {#each data.users as user (user.id)}
        <a
          role="tab"
          class="tab user"
          aria-selected={user.selected}
          aria-controls="panel"
          href="/admin/runners/{user.key}">
          <span class="user__name">{user.name}</span>
          {#if user.isAdmin}
            <span class="badge badge--admin">관리자</span>
          {/if}
          {#if user.isBanned}
            <span class="badge badge--banned">제명됨</span>
          {/if}
        </a>
      {/each}
    </div>
  </div>
  <div id="panel" role="tabpanel" class="tabpanel">
    {#key data.selected}
      {@render children()}
    {/key}
  </div>
</div>

<style lang="scss">
  ._ {
    display: grid;
    grid-template-columns: max-content 1fr;
    height: calc(100dvh - 2.5rem /* hard coded header height */);
  }
  ._left {
    display: grid;
    align-content: start;
    gap: 0.5rem;
    overflow: hidden scroll;
    background: var(--slate-2);
    padding: 0.25rem 0.5rem;
  }
  .tablist {
    display: grid;
    align-content: start;
  }
  .tab {
    text-decoration: none;
    padding: 0.25rem 0.5rem;

    &[aria-selected="true"] {
      background: var(--slate-4);
    }
  }
  .user {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    &__name {
      max-width: 6rem;
      text-overflow: ellipsis;
      text-wrap: nowrap;
      overflow: hidden;
    }
  }
  .tabpanel {
    overflow: hidden scroll;
  }
  .badge {
    border-radius: 0.25rem;
    padding: 0 0.25rem;
    font-size: 0.75rem;

    &--admin {
      background: var(--green-9);
      color: var(--green-1);
    }
    &--banned {
      background: var(--red-9);
      color: var(--red-1);
    }
  }
</style>
