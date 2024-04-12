<script lang="ts">
  import { api } from "$lib/api/api.gen";
  import type { LureData } from "$lib/data/sheets/model";
  import { lures } from "$lib/shared/config/lures";
  import {
    type Lures,
    useLures,
  } from "$routes/(main)/events/fishing/lures.svelte";
  import { useWallet } from "$routes/(main)/wallet.svelte";
  import { useLureData } from "../data/data.svelte";
  import FishingStoreLure from "./fishing-store-lure.svelte";

  const lureData = useLureData();
  const currentLures = useLures();
  const wallet = useWallet();

  const onclick = async (lure: LureData) => {
    if (lure.price.type === "chips") {
      if (wallet.chips < lure.price.quantity) {
        return onerror?.("칩이 부족합니다");
      }
      wallet.chips -= lure.price.quantity;
    } else if (lure.price.type === "tokens") {
      if (wallet.tokens < lure.price.quantity) {
        return onerror?.("칩이 부족합니다");
      }
      wallet.tokens -= lure.price.quantity;
    }
    currentLures[lure.key as keyof Lures]++;
    buffer = {
      ...buffer,
      [lure.key]: (buffer?.[lure.key as keyof Lures] ?? 0) + 1,
    };
    if (!pending) {
      send();
    }
  };
  const send = async () => {
    if (buffer == null) return;
    pending = true;
    const payload = buffer;
    buffer = undefined;
    const res = await api().events.fishing.lure.post(payload);
    try {
      if (!res.ok) {
        rollback(payload);
        onerror?.(res.error.message);
      }
    } catch (error) {}
    pending = false;
    send();
  };
  const rollback = (payload: Payload) => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const data = new Map(lureData.data!.map((x) => [x.key, x]));

    for (const key of lures) {
      const lureData = data.get(key);
      if (lureData == null) continue;
      const quantity = payload[key];
      if (quantity == null) continue;
      currentLures[key] -= quantity;
      if (lureData.price.type === "chips") {
        wallet.chips += quantity * lureData.price.quantity;
      } else if (lureData.price.type === "tokens") {
        wallet.tokens += quantity * lureData.price.quantity;
      }
    }
  };

  interface Payload {
    "까만 콩 지렁이"?: number;
    "토깽이 떡밥"?: number;
    "사우루숭 벌레 유충"?: number;
  }
  interface Props {
    onerror?: (message: string) => void;
    pending: boolean;
  }
  let { onerror, pending = $bindable() }: Props = $props();
  let buffer: Payload | undefined;
</script>

<div class="store">
  {#if lureData.data}
    {#each lureData.data as lure}
      <FishingStoreLure {lure} onclick={() => onclick(lure)} />
    {/each}
  {/if}
</div>

<style lang="scss">
  .store {
    display: grid;
    gap: 1rem;
  }
</style>
