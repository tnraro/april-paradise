<script lang="ts">
  interface Props {
    on: boolean;
  }
  let { on }: Props = $props();
</script>

<div class="bulb" class:bulb--on={on}>{on ? "켜짐" : "꺼짐"}</div>

<style>
  .bulb {
    background: var(--slate-3);
  }
  .bulb--on {
    background: var(--amber-9);
  }
</style>
