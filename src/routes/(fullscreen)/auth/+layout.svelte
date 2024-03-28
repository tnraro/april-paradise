<script lang="ts">
let { children } = $props();
</script>

<main>
  {@render children()}
</main>

<style lang="scss">
  main {
    width: min(20rem, 90%);
    margin: 0 auto;
    padding: 1rem;
  }
</style>
