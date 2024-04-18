<script lang="ts">
  interface Props {
    users: { id: string; name?: string; isBanned: boolean }[];
    onclose?: () => void;
    onsubmit?: (ban: boolean) => void | Promise<void>;
    ondone?: () => void;
  }
  let { users, onclose, onsubmit, ondone }: Props = $props();
</script>

<div class="_">
  <h1 class="_title">정말 제명하시겠습니까?</h1>
  <div class="_names">
    {#each users as { id, name, isBanned } (id)}
      <span class="_name" class:_name--banned={isBanned}>{name}</span>
    {/each}
  </div>
  <div class="_footer">
    <button onclick={onclose}>취소</button>
    <button
      class="blue emphasis"
      onclick={async () => {
        await onsubmit?.(false);
        onclose?.();
        ondone?.();
      }}>제명 해제</button
    >
    <button
      class="red emphasis"
      onclick={async () => {
        await onsubmit?.(true);
        onclose?.();
        ondone?.();
      }}>제명</button
    >
  </div>
</div>

<style lang="scss">
  @use "$lib/ui/styles/mixin";
  ._ {
    display: grid;
    gap: 0.5rem;
    &title {
      font-size: 1rem;
      line-height: 1;
    }
    &names {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 0.25rem;
    }
    &footer {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }
    &name {
      @include mixin.select-none;
      border-radius: 0.25rem;
      padding: 0 0.25rem;
      font-size: 0.75rem;
      word-break: keep-all;
      background: var(--slate-3);

      &--banned {
        background: var(--red-9);
        color: var(--red-1);
      }
    }
  }
</style>
