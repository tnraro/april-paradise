<script lang="ts">
  let { data } = $props();

  const i = Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "narrow",
    hour12: true,
    dayPeriod: "long",
    hour: "numeric",
    minute: "numeric",
  });
</script>

<table>
  <thead>
    <tr>
      <th>이벤트</th>
      <th>시작</th>
      <th>끝</th>
    </tr>
  </thead>
  <tbody>
    {#each data.data as row}
      <tr>
        <td class="title">{row.title}</td>
        <td class="time">{i.format(row.start)}</td>
        <td class="time">{i.format(row.end)}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  .title {
    font-weight: 700;
  }
  .time {
    color: var(--slate-11);
  }
  td {
    padding: 0 1ch;
  }
</style>
