<script lang="ts">
  import Item from "$lib/ui/item/item.svelte";

  let { data } = $props();
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
        <td class="key">{row.key}</td>
        <td class="probability">{row.probability * 100}%</td>
        <td class="item"><Item item={row.result} /></td>
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  td {
    padding: 0 1ch;
  }
  .probability {
    text-align: right;
  }
</style>
