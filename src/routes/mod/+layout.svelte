<script lang="ts">
  let { children, data } = $props();
</script>

<header>
  <div>관리 페이지</div>
  <div>
    {#if data.admin.is_god}
      <span title={`"신"`}>💛</span>
    {/if}
    <span>{data.admin.name}</span>
  </div>
</header>
{@render children()}
