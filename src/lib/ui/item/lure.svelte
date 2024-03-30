<script lang="ts">
  interface Props {
    lure: string;
  }
  let { lure }: Props = $props();
</script>

<enhanced:img class="lure" src="$img/lure.png?w=64" />

<style>
  .lure {
    max-width: fit-content;
  }
</style>
