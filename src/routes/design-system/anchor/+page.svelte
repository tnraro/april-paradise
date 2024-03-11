<div class="grid">
  <div>기본 버튼</div>
  <div class="elements">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a>href 없는 링크</a>
    <a href="#1">있는 링크</a>
    <a href="#2" aria-current="page">활성화된 링크</a>
  </div>
</div>

<style lang="scss">
  .elements {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
  }
</style>
