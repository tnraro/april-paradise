<div class="grid">
  <div>기본 버튼</div>
  <div class="elements">
    <button>버튼</button>
  </div>
  <div>변종</div>
  <div class="elements">
    <button class="red">버튼 빨강</button>
    <button class="blue">버튼 파랑</button>
    <button class="green">버튼 초랑</button>
  </div>
  <div>변종 2</div>
  <div class="elements">
    <button class="red emphasis">버튼 빨강</button>
    <button class="blue emphasis">버튼 파랑</button>
    <button class="green emphasis">버튼 초랑</button>
    <button class="emphasis">그냥 버튼</button>
  </div>
  <div>비활성화</div>
  <div class="elements">
    <button class="green" disabled>버튼 비활성화</button>
    <button class="emphasis green" disabled>버튼 비활성화</button>
  </div>
</div>

<style lang="scss">
  .elements {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
  }
</style>
