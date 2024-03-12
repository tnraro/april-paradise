<script lang="ts">
  let { children } = $props();
</script>

<main>
  {@render children()}
</main>

<style lang="scss">
  main {
    max-width: 20rem;
    margin: 0 auto;
  }
</style>
