<script lang="ts">
  import { api } from "$lib/api/api.gen";
  import { type FishingData, FishingGrade, type Money } from "$lib/data/sheets/model.js";
  import { groupBy } from "$lib/shared/util/group-by.js";
  import { repeat } from "$lib/shared/util/repeat";
  import { sleep } from "$lib/shared/util/sleep";
  import AchievementComponent from "$lib/ui/achievement/achievement-component.svelte";
  import { useLureData } from "$lib/ui/data/data.svelte.js";
  import FishingApproach from "$lib/ui/fishing/fishing-approach.svelte";
  import FishingCatchphrase from "$lib/ui/fishing/fishing-catchphrase.svelte";
  import FishingCaughtFish from "$lib/ui/fishing/fishing-caught-fish.svelte";
  import FishingCurrentLures from "$lib/ui/fishing/fishing-current-lures.svelte";
  import { fight } from "$lib/ui/fishing/fishing-fighting";
  import FishingFighting from "$lib/ui/fishing/fishing-fighting.svelte";
  import FishingFishPortrait from "$lib/ui/fishing/fishing-fish-portrait.svelte";
  import FishingLures from "$lib/ui/fishing/fishing-lures.svelte";
  import {
    FishingState,
    createFishing,
  } from "$lib/ui/fishing/fishing-state.svelte";
  import FishingStore from "$lib/ui/fishing/fishing-store.svelte";
  import Achievement from "$lib/ui/floating/achievement.svelte";
  import Dialog from "$lib/ui/floating/dialog.svelte";
  import InventoryItem from "$lib/ui/inventory/inventory-item.svelte";
  import Tab from "$lib/ui/tab/tab.svelte";
  import { useWallet } from "$routes/(main)/wallet.svelte.js";
  import { useBowl } from "./bowl.svelte.js";
  import { type Lures, useLures } from "./lures.svelte.js";
  const vibrate = async (size: number) => {
    const r = Math.random() * Math.PI * 2;
    const s = Math.random() * size * size;
    x = Math.cos(r) * s;
    y = Math.sin(r) * s;
    for await (const _ of repeat(size, 100)) {
      x *= -0.5;
      y *= -0.5;
      const d = Math.sqrt(x * x + y * y);
      navigator.vibrate((Math.max(25, d) / 25) * 100);
    }
    x = 0;
    y = 0;
  };
  const enum TabIndex {
    Game,
    Bowl,
    Achievement,
    Store,
  }
  const pull = (e: Event) => {
    e.preventDefault();
    isPulling = true;
  };
  const release = (e: Event) => {
    e.preventDefault();
    isPulling = false;
  };
  const wallet = useWallet();
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
      setTimeout(S.wait, 0);
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
            } else {
              const xs = res.data.achievements.map(x => {
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                return achievementDataMap.get(x)!;
              });
              achievements.push(...xs);
              newAchievements = xs.map(achievement => {
                return ({
                  id: crypto.randomUUID(),
                  name: achievement.name,
                  condition: achievement.condition,
                  reward: achievement.reward,
                  isHidden: achievement.isHidden,
                })
              }
              );
              setTimeout(() => {
                for (const a of newAchievements) {
                  if (a.reward.type === "tokens") {
                    wallet.tokens += a.reward.quantity;
                  } else if (a.reward.type === "chips") {
                    wallet.chips += a.reward.quantity;
                  }
                }
                newAchievements = []; 
              }, 5000);
              bowl.addFish(fish.key);
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
  useLureData(data.lureData);
  let currentLures = useLures(data.lures);
  let selectedLure = $state<keyof Lures>("까만 콩 지렁이");
  let errorMessage = $state<string>();

  let achievementDataMap = $derived(new Map(data.achievementData.map(x => [x.key, x])));

  let bowl = useBowl(data.items);

  let fishData = $derived(new Map(data.fishData.map(x => [x.key, x])));

  let groupedFishes = $derived.by(() => {
    const map = new Map(bowl.fishes.map(x => [x.key, x]));
    const fishData = data.fishData.filter(x => !x.key.startsWith("losing-")).reduce((a, x) => {
      if (a.find(y => y.key === x.key) == null){
        a.push(x);
      }
      return a;
    }, [] as FishingData[]);
    const groupedFishes = groupBy(fishData, (x) => x.grade);
    return Array.from(groupedFishes, ([key, items]) => ({
      grade: key,
      items: items.map(item => ({
        ...item,
        quantity: map.get(item.key)?.quantity ?? 0
      }))
    }))
      .sort((a, b) => b.grade - a.grade);
  });

  let isPulling = $state(false);
  let powerRatio = $state(0);
  let hpRatio = $state(0);
  let enRatio = $state(0);

  let x = $state(0);
  let y = $state(0);

  let newAchievements = $state<
    {
      id: string;
      name: string;
      condition: string;
      reward: Money;
      isHidden: boolean;
    }[]
  >([]);

  let achievements = $state<{
    key: string;
    name: string;
    condition: string;
    reward: Money;
    isHidden: boolean;
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  }[]>(data.achievements.map(x => achievementDataMap.get(x.key)!));

  let achievementList = $derived.by(() => {
    const map = new Map(achievements.map(x => [x.key, x]));
    
    return data.achievementData.map(x => {
      return {
        ...x,
        isDone: map.has(x.key)
      }
    });
  });
</script>

{#snippet fishDescription(fish: FishingData)}  
  <h1 class="fish--grade-{fish.grade}">{fish.name}</h1>
  <div class="fish__description">
    {fish.description}
  </div>
  <div>미끼: {fish.lure}</div>
{/snippet}
{#snippet tab(index: number)}
  {#if index === TabIndex.Game}
    <enhanced:img class="pixel" src="$img/rod.png?w=64" alt="" />
  {:else if index === TabIndex.Bowl}
    <enhanced:img class="pixel" src="$img/fishing-bowl.png?w=64" alt="" />
  {:else if index === TabIndex.Achievement}
    <enhanced:img class="pixel" src="$img/fishing-medal.png?w=64" alt="" />
  {:else if index === TabIndex.Store}
    <enhanced:img class="pixel" src="$img/fishing-store.png?w=64" alt="" />
  {/if}
{/snippet}
{#snippet tabpanel(index: number)}
  {#if index === TabIndex.Game}
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
        ontouchstart={e => e.preventDefault()}
      >당기기</button>
    {/if}
  {:else if index === TabIndex.Bowl}
    <div>
      {#each groupedFishes as { grade, items } (grade)}
        <h1 class="title"
          class:fish--grade-0={grade === FishingGrade.Common}
          class:fish--grade-1={grade === FishingGrade.Uncommon}
          class:fish--grade-2={grade === FishingGrade.Heroic}
          class:fish--grade-3={grade === FishingGrade.Legendary}
          class:fish--grade-4={grade === FishingGrade.Mythic}
        >
          {#if grade === FishingGrade.Common}
            일반 물고기
          {:else if grade === FishingGrade.Uncommon}
            고급 물고기
          {:else if grade === FishingGrade.Heroic}
            영웅 물고기
          {:else if grade === FishingGrade.Legendary}
            전설 물고기
          {:else if grade === FishingGrade.Mythic}
            신화 물고기
          {/if}
        </h1>
        <div class="inventory">
          {#each items as item}
            {@const fish = fishData.get(item.key)}
            <InventoryItem {...item}>
              {#if fish}
                {@render fishDescription(fish)}
              {/if}
            </InventoryItem>
          {/each}
        </div>
      {/each}
    </div>
  {:else if index === TabIndex.Achievement}
    <div>
      <h1 class="title">업적</h1>
      {#each achievementList as achievement}
        <AchievementComponent {...achievement} />
      {/each}
    </div>
  {:else if index === TabIndex.Store}
    <div>
      <h1 class="title">미끼 상점</h1>
      <FishingStore onerror={S.error} />
    </div>
  {/if}
{/snippet}

<main>
  <div class="imgs">
    {#if S.state === FishingState.Waiting ||
         S.state === FishingState.Approaching ||
         S.state === FishingState.Biting}
      {#if S.caughtFish}
        <FishingApproach
          s={S.state}
          grade={S.caughtFish.grade ?? 0}
          onbite={S.bite}
        />
      {/if}
    {:else if S.state === FishingState.Pulling}
      {#if S.caughtFish} 
        <FishingFighting fish={S.caughtFish} {hpRatio} {enRatio} {powerRatio} />
      {/if}
    {/if}
  </div>
  <div class="tabs">
    <Tab prefix="fishing" n={4} {tab} {tabpanel} />
    <div class="lures">
      <FishingCurrentLures {currentLures} />
    </div>
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
      <button
        onclick={() => {
          errorMessage = undefined;
          S.idle();
        }}>그렇군요</button
      >
    </div>
  </Dialog>
{/if}
{#each newAchievements as achievement (achievement.id)}
  <Achievement
    {...achievement} 
    onclose={() => {
      newAchievements = newAchievements.filter((x) => x.id !== achievement.id);
      if (achievement.reward.type === "tokens") {
        wallet.tokens += achievement.reward.quantity;
      } else if (achievement.reward.type === "chips") {
        wallet.chips += achievement.reward.quantity;
      }
    }}
  />
{/each}

<style lang="scss">
  main {
    display: grid;
    height: 100%;
    grid-template-rows: 50% 50%;
    justify-content: center;
    max-width: 23rem;
    margin: 0 auto;
  }
  .imgs {
    display: grid;
    place-items: center;
    background: url("$img/fishing/background.png");
    background-position: center;
    background-size: cover;
  }
  .title {
    margin-bottom: 1rem;
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
  :global(.fishing__tab[aria-selected="true"]) {
    background: var(--blue-3);
  }
  :global(.fishing__tabpanel) {
    display: grid;
    padding: 0 1rem;
    border-radius: 1rem;
    overflow-y: auto;
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
  .inventory {
    display: grid;
    grid-template-columns: repeat(auto-fill, 64px);
    gap: 1rem;
    justify-content: center;
    margin-bottom: 4rem;
  }
  .store-lures {
    display: grid;
    gap: 1rem;
  }
  .lures {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -110%);
  }
  .fish {
    &--grade-0 {
      color: var(--slate-10);
    }
    &--grade-1 {
      color: var(--green-10);
    }
    &--grade-2 {
      color: var(--blue-10);
    }
    &--grade-3 {
      color: var(--purple-10);
    }
    &--grade-4 {
      color: var(--amber-10);
    }
    &__description {
      color: var(--slate-11);
      word-break: keep-all;
    }
  }
</style>
