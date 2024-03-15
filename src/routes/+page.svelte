<script lang="ts">
  let token = $state("");
</script>

WIP

<input
  bind:value={token}
  onchange={() => {
    document.cookie = `token=${token}`;
  }}
/>
