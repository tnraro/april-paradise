<div class="grid">
  <div>기본 입력</div>
  <div class="elements">
    <input placeholder="입력해주세요" />
    <input type="text" value="입력했어요" />
  </div>
  <div>변종 (글자)</div>
  <div class="elements">
    <input type="date" />
    <input type="datetime-local" />
    <input type="email" value="noreply@email.com" />
    <input type="hidden" value="비밀" />
    <input type="month" />
    <input type="number" />
    <input type="password" value="$ecret" />
    <input type="search" />
    <input type="tel" />
    <input type="text" />
    <input type="time" />
    <input type="url" />
    <input type="week" />
  </div>
  <div>변종 (버튼)</div>
  <div class="elements">
    <input type="button" value="입력" />
    <input type="submit" value="전송" />
    <input type="reset" value="초기화" />
  </div>
  <div>변종 (나머지)</div>
  <div class="elements">
    <input type="checkbox" />
    <input type="radio" />
    <input type="color" />
    <input type="checkbox" role="switch" />
  </div>
  <div>비활성화</div>
  <div class="elements">
    <input disabled />
    <input type="date" disabled />
    <input type="password" value="$ecret" disabled />
    <input type="button" value="입력" disabled />
    <input type="checkbox" disabled />
    <input type="radio" disabled />
    <input type="checkbox" role="switch" disabled />
  </div>
  <div>기타</div>
  <div class="elements">
    <input type="file" />
    <input type="range" />
    <input type="image" alt="" src="/favicon.png" />
  </div>
</div>

<style lang="scss">
  .elements {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
  }
</style>
