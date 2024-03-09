<script lang="ts">
  let { children, data } = $props();
</script>

<header>
  <div>관리 페이지</div>
  <div>
    {#if data.host.is_god}
      <span title={`"신"`}>💛</span>
    {/if}
    <span>{data.host.name}</span>
  </div>
</header>
{@render children()}
