<script lang="ts">
  import type { FishingData } from "$lib/data/sheets/model";
  import { sleep } from "$lib/shared/util/sleep";
  import FishingFish from "./fishing-fish.svelte";
  import FishingWave from "./fishing-wave.svelte";

  const enum FishingState {
    Idle,
    Casting,
    Waiting,
    Biting,
    Pulling,
    Caught,
    Missing,
    Snapped,
  }
  let t: number;
  const cast = async () => {
    _state = FishingState.Casting;
    setTimeout(() => {
      _state = FishingState.Waiting;
    }, 400);
    catchingFish = await oncast?.(lure);
    if (catchingFish == null) throw "fish is null";
    await sleep(1000);
    noise(catchingFish.grade);
    _state = FishingState.Biting;

    t = setTimeout(() => {
      _state = FishingState.Missing;
    }, 3000) as unknown as number;
  };
  const pull = async () => {
    clearTimeout(t);
    if (catchingFish == null) throw "fish is null";
    _state = FishingState.Pulling;
    noise(catchingFish.grade);
    hpRatio = 1;
    const hp = catchingFish.hp ?? catchingFish.grade * 5 + 3;
    const power = catchingFish.power ?? catchingFish.grade * 1 + 1;
    const rampancy = catchingFish.rampancy ?? catchingFish.grade * 1 + 1;
    const endurance = catchingFish.endurance ?? 1 - catchingFish.grade * 0.2;
    const delta = 16;
    const it = fighting({
      hp,
      power,
      rampancy,
      endurance,
      delta,
    });
    while (true) {
      await sleep(delta);
      const { done, value } = it.next(isPulling);
      ratio = value.ratio;
      hpRatio = value.hp / hp;
      enRatio = value.endurance / endurance;
      if (isPulling) {
        const p = (value.damage * 1000) / delta;
        if (p / power > 0.5) {
          noise(p);
        }
      }
      if (done) {
        isPulling = false;
        if (value.ratio <= 0) {
          _state = FishingState.Missing;
        } else if (value.ratio >= 1) {
          _state = FishingState.Snapped;
        } else {
          _state = FishingState.Caught;
          noise(catchingFish.grade);
        }
        break;
      }
    }
  };
  interface FightingOptions {
    hp: number;
    power: number;
    rampancy: number;
    endurance: number;
    delta: number;
  }
  function* fighting({
    hp,
    power,
    rampancy,
    endurance,
    delta,
  }: FightingOptions) {
    let ratio = 0.5;
    let t = 0;
    let _hp = hp;
    let _endurance = 0;
    const T = delta / 1000;
    let damage = 0;
    while (_endurance < endurance && _hp > 0) {
      const isPulling: boolean = yield {
        ratio,
        hp: _hp,
        endurance: _endurance,
        damage,
      };
      t += Math.random() * rampancy + T;
      damage = (Math.sin(t) + 1) * power * T;
      if (isPulling) {
        ratio += damage;
        _hp -= damage;
      } else {
        ratio -= damage;
      }
      ratio = Math.max(0, Math.min(1, ratio));
      if (ratio <= 0 || ratio >= 1) {
        _endurance += T;
        _endurance = Math.min(endurance, _endurance);
      } else {
        _endurance -= T;
        _endurance = Math.max(0, _endurance);
      }
      _hp -= T;
    }
    return { ratio, hp: Math.max(0, _hp), endurance: _endurance, damage };
  }
  const confirm = () => {
    _state = FishingState.Idle;
  };
  const noise = async (size: number) => {
    const r = Math.random() * Math.PI * 2;
    const s = Math.random() * size * size;
    mbx = Math.cos(r) * s;
    mby = Math.sin(r) * s;
    for (let i = 0; i < size; i++) {
      await sleep(100);
      mbx *= -0.5;
      mby *= -0.5;
    }
    mbx = 0;
    mby = 0;
  };

  type CatchingFish = Pick<
    FishingData,
    | "key"
    | "name"
    | "catchphrase"
    | "grade"
    | "hp"
    | "power"
    | "rampancy"
    | "endurance"
  >;
  interface Props {
    oncast?: (lure: string) => Promise<CatchingFish>;
  }
  let { oncast } = $props<Props>();

  let _state = $state<FishingState>(FishingState.Idle);
  let lure = $state("까만 콩 지렁이");

  let catchingFish = $state<CatchingFish>();
  let hpRatio = $state(0);
  let enRatio = $state(0);
  let ratio = $state(0);
  let isPulling = $state(false);

  let mbx = $state(0);
  let mby = $state(0);
</script>

<div>
  <label>
    미끼:
    <select bind:value={lure}>
      <option value="까만 콩 지렁이">까만 콩 지렁이</option>
      <option value="토깽이 떡밥">토깽이 떡밥</option>
      <option value="사우루숭 벌레 유충">사우루숭 벌레 유충</option>
    </select>
  </label>
  <div class="_" style="transform:translate({mbx}px,{mby}px)">
    {#if _state === FishingState.Idle}
      <button class="blue emphasis" onclick={cast}>던지기</button>
    {:else if _state === FishingState.Casting}
      던지는 모션
    {:else if _state === FishingState.Waiting}
      물고기가 잡힐 때까지 기다리는 중
    {:else if _state === FishingState.Biting}
      물었따
      <button class="blue emphasis" onclick={pull}>낚아채기</button>
    {:else if _state === FishingState.Pulling}
      영차영차
      <div
        style="position:relative;width:20rem;height:2rem;background:gainsboro;"
      >
        <div
          style="position:absolute;top:0;left:0;width:{100 *
            ratio}%;background:red;height:100%;"
        />
        <div
          style="position:absolute;top:0;left:0;width:{100 *
            hpRatio}%;background:yellow;height:4px;"
        />
        <div
          style="position:absolute;bottom:0;left:0;width:{100 *
            enRatio}%;background:black;height:4px;"
        />
        <div
          style="position:absolute;top:0;left:0;right:0;bottom:0;text-align:center;"
        >
          {(hpRatio * 100).toFixed(1)}%
        </div>
      </div>
      <button
        class="red emphasis"
        onmousedown={() => (isPulling = true)}
        onmouseup={() => (isPulling = false)}
        onpointerdown={() => (isPulling = true)}
        onpointerup={() => (isPulling = false)}>당기기</button
      >
    {:else if _state === FishingState.Caught}
      {#if catchingFish}
        {#if catchingFish.key.startsWith("losing-")}
          <button onclick={confirm}>그렇군요</button>
        {:else if catchingFish.grade >= 3}
          <button class="blue" onclick={confirm}>오예</button>
        {:else}
          <button class="blue" onclick={confirm}>그렇군요</button>
        {/if}
        <FishingFish fish={catchingFish} />
      {:else}
        <button class="red" onclick={confirm}>모...모임? 버그임</button>
      {/if}
    {:else if _state === FishingState.Missing}
      놓쳤따
      <button
        class="blue"
        onclick={() => {
          _state = FishingState.Idle;
        }}>힝</button
      >
    {:else if _state === FishingState.Snapped}
      줄이 끊어졌다
      <button
        class="blue"
        onclick={() => {
          _state = FishingState.Idle;
        }}>힝</button
      >
    {/if}
  </div>
  <svg width="0" height="0">
    <defs>
      <filter id="fishing-motion-blur">
        <feGaussianBlur stdDeviation="{Math.abs(mbx)} {Math.abs(mby)}" />
      </filter>
    </defs>
  </svg>
</div>

<!-- <svg width="100%" viewBox="-500 -500 1000 1000">
  <FishingWave />
</svg> -->
