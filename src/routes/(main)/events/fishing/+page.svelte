<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { api } from "$lib/api/api.gen";
  import { repeat } from "$lib/shared/util/repeat";
  import { sleep } from "$lib/shared/util/sleep";
  import FishingCatchphrase from "$lib/ui/fishing/fishing-catchphrase.svelte";
  import { default as FishingCaughtFish, default as FishingFish } from "$lib/ui/fishing/fishing-caught-fish.svelte";
  import { fight } from "$lib/ui/fishing/fishing-fighting";
  import FishingFighting from "$lib/ui/fishing/fishing-fighting.svelte";
  import FishingFishPortrait from "$lib/ui/fishing/fishing-fish-portrait.svelte";
  import FishingLures from "$lib/ui/fishing/fishing-lures.svelte";
  import { FishingState, createFishing } from "$lib/ui/fishing/fishing-state.svelte";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import Item from "$lib/ui/item/item.svelte";
  import Lure from "$lib/ui/item/lure.svelte";
  import Tab from "$lib/ui/tab/tab.svelte";
  const vibrate = async (size: number) => {
    const r = Math.random() * Math.PI * 2;
    const s = Math.random() * size * size;
    x = Math.cos(r) * s;
    y = Math.sin(r) * s;
    for await (const _ of repeat(size, 100)) {
      x *= -0.5;
      y *= -0.5;
      const d = Math.sqrt(x * x + y * y);
      navigator.vibrate(Math.max(25, d) / 25 * 100);
    }
    x = 0;
    y = 0;
  }
  const pull = () => {
    isPulling = true
  };
  const release = () => {
    isPulling = false
  };
  const S = createFishing({
    async oncast(lure) {
      if (currentLures[lure] <= 0) {
        throw "미끼가 모자랍니다";
      }
      currentLures[lure]--;
      const res = await api().events.fishing.post({
        lure: lure as "까만 콩 지렁이" | "토깽이 떡밥" | "사우루숭 벌레 유충",
      });
      if (!res.ok) throw res.error.message;
      setTimeout(S.wait, 200);
      return res.data.result;
    },
    onbite(fish) {
      vibrate(fish.grade);
    },
    async onpull(fish) {
      const hp = fish.hp ?? fish.grade * 5 + 3;
      const power = fish.power ?? fish.grade * 1 + 1;
      const rampancy = fish.rampancy ?? fish.grade * 1 + 1;
      const endurance = fish.endurance ?? 1 - fish.grade * 0.2;
      const delta = 16;
      const it = fight({
        hp,
        power,
        rampancy,
        endurance,
        delta,
      });
      while (true) {
        await sleep(delta);
        const { done, value } = it.next(isPulling);
        powerRatio = value.ratio;
        hpRatio = value.hp / hp;
        enRatio = value.endurance / endurance;
        if (isPulling) {
          const p = (value.damage * 1000) / delta;
          if (p / power > 0.5) {
            vibrate(p);
          }
        }
        if (done) {
          isPulling = false;
          if (enRatio >= 0.3 && value.ratio <= 0) {
            S.miss();
          } else if (enRatio >= 0.3 && value.ratio >= 1) {
            S.snap();
          } else {
            S.catchFish();
            const res = await api().events.fishing.put({ next: fish.next });
            if (!res.ok) {
              S.error("무언가 잘못되었습니다", res.error);
            }
          }
          break;
        }
      }
    },
    onerror(message) {
      errorMessage = message;
    },
  });

  let { data } = $props();
  let currentLures = $state(data.lures as Record<string, number>);
  let selectedLure = $state("까만 콩 지렁이");
  let errorMessage = $state<string>();

  let isPulling = $state(false);
  let powerRatio = $state(0);
  let hpRatio = $state(0);
  let enRatio = $state(0);

  let x = $state(0);
  let y = $state(0);
</script>

{#snippet tab(index: number)}
  {#if index === 0}
    께임
  {:else if index === 1}
    <enhanced:img class="pixel" src="$img/fishing-port.png?w=64" alt="" />
    어항
  {:else if index === 2}
    <enhanced:img class="pixel" src="$img/fishing-medal.png?w=64" alt="" />
    업적
  {:else if index === 3}
    상점
  {/if}
{/snippet}
{#snippet tabpanel(index: number)}
  {#if index === 0}
    {#if S.state === FishingState.Idle}
      <FishingLures bind:value={selectedLure} {currentLures} />
      <button class="blue emphasis tab__btn" onclick={() => S.cast(selectedLure)}>던지기</button>
    {:else if S.state === FishingState.Biting}
      <button class="blue emphasis tab__btn" onclick={S.pull}>낚아채기</button>
    {:else if S.state === FishingState.Pulling}
      <button class="red emphasis tab__btn"
        onmousedown={pull}
        onpointerdown={pull}
        onmouseup={release}
        onpointerup={release}
      >당기기</button>
    {/if}
  {:else if index === 1}
    <enhanced:img class="pixel" src="$img/fishing-port.png?w=64" alt="" />
  {:else if index === 2}
    <enhanced:img class="pixel" src="$img/fishing-medal.png?w=64" alt="" />
  {:else if index === 3}
    상점
    {#each data.lureData as lure}
      <div class="lure">
        <Lure lure={lure.key} />
        <div>
          <div class="lure__name">{lure.name}</div>
          <div class="lure__price">가격: <Item item={lure.price} /></div>
        </div>
        <button class="blue" onclick={async () => {
          const res = await api().events.fishing.lure.post({
            lure: lure.key as any
          });
          if (!res.ok) {
            S.error(res.error.message);
          } else {
            invalidate("header");
          }
        }}>구매하기</button>
      </div>
    {/each}
  {/if}
{/snippet}

<main>
  <div class="imgs">
    {#if S.state === FishingState.Idle}
      파도가 넘실거리는 그림
    {:else if S.state === FishingState.Casting}
      낚시대를 휘두르는 그림
    {:else if S.state === FishingState.Waiting} 
      기다리는 그림
    {:else if S.state === FishingState.Biting}
      물고깅이 미끼를 문 그림
    {:else if S.state === FishingState.Pulling}
      물고깅을 당기는 그림

      {#if S.caughtFish}
        <FishingFighting fish={S.caughtFish} {hpRatio} {enRatio} {powerRatio} />
      {/if}
    {:else if S.state === FishingState.Caught}
      물고깅을 잡은 그림

      {#if S.caughtFish}
        <FishingFish fish={S.caughtFish} />
      {/if}
    {:else if S.state === FishingState.Missing}
      물고깅을 놓친 그림
    {:else if S.state === FishingState.Snapped}
      낚시줄이 끊어진 그림
    {/if}
  </div>
  <div class="tabs">
    <Tab prefix="fishing" n={4} {tab} {tabpanel}/>
  </div>
</main>

{#if S.state === FishingState.Caught && S.caughtFish}
  <Dialog>
    <div class="caught-fish-dialog">
      <FishingFishPortrait fish={S.caughtFish} />
      <FishingCaughtFish fish={S.caughtFish} />
      <FishingCatchphrase fish={S.caughtFish} />
      <button onclick={S.idle}>그렇군요</button>
    </div>
  </Dialog>
{:else if S.state === FishingState.Missing}
  <Dialog>
    <div class="caught-fish-dialog">
      물고기를 놓쳤다!
      <button onclick={S.idle}>그렇군요</button>
    </div>
  </Dialog>
{:else if S.state === FishingState.Snapped}
  <Dialog>
    <div class="caught-fish-dialog">
      낚시줄이 끊어졌다!
      <button onclick={S.idle}>그렇군요</button>
    </div>
  </Dialog>
{/if}
{#if errorMessage}
  <Dialog>
    <div class="caught-fish-dialog">
      {errorMessage}
      <button onclick={() => {
        errorMessage = undefined;
        S.idle();
      }}>그렇군요</button>
    </div>
  </Dialog>
{/if}

<style lang="scss">
  main {
    display: grid;
    height: 100%;
    grid-template-rows: 1fr 1fr;
    justify-content: center;
  }
  .imgs {
    display: grid;
    place-items: center;
  }
  .tabs {
    display: grid;
    grid-template-rows: max-content 1fr;
  }
  :global(.fishing__tablist) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  :global(.fishing__tab) {
    display: grid;
    justify-content: center;
  }
  :global(.fishing__tab[aria-selected=true]) {
    background: var(--blue-3);
  }
  :global(.fishing__tabpanel) {
    display: grid;
    border: 1px solid var(--slate-6);
    margin: 1rem;
    padding: 1rem;
    border-radius: 1rem;
  }
  .caught-fish-dialog {
    display: grid;
    gap: 0.25rem;
  }
  .tab__btn {
    display: grid;
    place-items: center;
    text-align: center;
    font-weight: 700;
    font-size: 3rem;
    font-family: var(--font-serif);
  }
  .lure {
    display: grid;
    grid-template-columns: min-content 1fr max-content;
    align-items: center;

    &__name {
      font-weight: 700;
    }
    &__price {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
</style>
