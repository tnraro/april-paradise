<script lang="ts">
  import AchievementComponent from "$lib/ui/achievement/achievement-component.svelte";

  let { data } = $props();
</script>

<div class="_">
  {#each data.data as row}
    <AchievementComponent {...row} isDone={true} />
  {/each}
</div>

<style lang="scss">
  ._ {
    display: grid;
    max-width: max-content;
  }
</style>
