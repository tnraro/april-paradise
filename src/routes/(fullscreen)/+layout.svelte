<script lang="ts">
  let { children } = $props();
</script>

<div class="_">
  {@render children()}
</div>

<style lang="scss">
  ._ {
    display: grid;
    align-items: center;
    height: 100dvh;
  }
</style>