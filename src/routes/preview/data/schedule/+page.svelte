<script lang="ts">
  let { data } = $props();

  let dateStyle = $state<"full" | "long" | "medium" | "short">("long");
  let timeStyle = $state<"full" | "long" | "medium" | "short">("short");
  let calendar = $state<string>();
  let i = $derived(
    Intl.DateTimeFormat("ko-KR", {
      dateStyle,
      timeStyle,
      calendar,
    }),
  );
</script>

<h1>{data.name}</h1>
<select bind:value={dateStyle}>
  <option value="full">전체</option>
  <option value="long">길게</option>
  <option value="medium">중간</option>
  <option value="short">짧게</option>
</select>
<select bind:value={timeStyle}>
  <option value={undefined}>생략</option>
  <option value="full">전체</option>
  <option value="long">길게</option>
  <option value="medium">중간</option>
  <option value="short">짧게</option>
</select>
<select bind:value={calendar}>
  <option value={undefined}>그레고리</option>
  <option value="dangi">단기</option>
</select>
<div class="_">
  <div class="__title">키</div>
  <div class="__title">시작</div>
  <div class="__title">끝</div>
  {#each data.data as row (row.key)}
    <div class="__key" title={row.key}>{row.key}</div>
    {#if row.start}
      <div>{i.format(row.start)}</div>
    {:else}
      <div class="__null">empty</div>
    {/if}
    {#if row.end}
      <div>{i.format(row.end)}</div>
    {:else}
      <div class="__null">empty</div>
    {/if}
  {/each}
</div>

<style>
  ._ {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: 0.25rem 0.5rem;
    align-items: center;
  }
</style>
