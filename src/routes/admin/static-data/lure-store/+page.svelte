<script lang="ts">
  let { data } = $props();
</script>

<div class="_">
  {#each data.data as row}
    {row.name}
  {/each}
</div>

<style lang="scss">
  ._ {
    display: grid;
    max-width: max-content;
  }
</style>
