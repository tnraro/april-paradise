import type { FishingData } from "$lib/data/sheets/model";
import { sleep } from "$lib/shared/util/sleep";
import type { Lures } from "$routes/(main)/events/fishing/lures.svelte";
import { sendError } from "../error/send-error";

export const enum FishingState {
  Idle,
  Waiting,
  Approaching,
  Biting,
  Pulling,
  Pending,
  Caught,
  Missing,
  Snapped,
  Retry,
}

export type CaughtFish = Pick<
  FishingData,
  | "key"
  | "name"
  | "catchphrase"
  | "grade"
  | "hp"
  | "power"
  | "rampancy"
  | "endurance"
> & { next: string };
interface FishingOptions {
  oncast: (lure: keyof Lures) => Promise<CaughtFish>;
  onapproaching?: (fish: CaughtFish) => void;
  onbite?: (fish: CaughtFish) => void;
  onpull?: (fish: CaughtFish) => void;
  oncatch?: (fish: CaughtFish) => void;
  onerror?: (message: string) => void;
}
export const createFishing = (options: FishingOptions) => {
  let state = $state<FishingState>(FishingState.Idle);
  let caughtFish = $state<CaughtFish>();

  let timeout: number;

  const idle = () => {
    state = FishingState.Idle;
    caughtFish = undefined;
  };
  const cast = async (lure: keyof Lures) => {
    if (state !== FishingState.Idle) return;
    try {
      state = FishingState.Waiting;
      await Promise.all([
        options.oncast(lure).then((fish) => {
          caughtFish = fish;
        }),
        sleep(3000 + Math.random() * 1000 + Math.random() * 1000),
      ]);
      approaching();
    } catch (e) {
      if (typeof e === "string") {
        throw error(e);
      }
      error("무언가 잘못되었습니다", e);
    }
  };
  const approaching = () => {
    if (state !== FishingState.Waiting) return;
    if (caughtFish == null) throw error("caught fish is null", "approaching()");
    state = FishingState.Approaching;
    options.onapproaching?.(caughtFish);
  };
  const bite = () => {
    if (state !== FishingState.Approaching) return;
    if (caughtFish == null) throw error("caught fish is null", "bite()");
    state = FishingState.Biting;
    options.onbite?.(caughtFish);
    timeout = setTimeout(() => {
      miss();
    }, 3000) as unknown as number;
  };
  const miss = () => {
    if (state !== FishingState.Biting && state !== FishingState.Pulling) return;
    state = FishingState.Missing;
  };
  const pull = () => {
    if (state !== FishingState.Biting) return;
    clearTimeout(timeout);
    if (caughtFish == null) throw error("caught fish is null", "pull()");
    state = FishingState.Pulling;
    options.onpull?.(caughtFish);
  };
  const snap = () => {
    if (state !== FishingState.Pulling) return;
    state = FishingState.Snapped;
  };
  const pending = () => {
    state = FishingState.Pending;
  };
  const catchFish = () => {
    if (state !== FishingState.Pending) return;
    if (caughtFish == null) throw error("caught fish is null", "catchFish()");
    state = FishingState.Caught;
    options.oncatch?.(caughtFish);
  };
  const error = (message: string, additionalInformation?: unknown) => {
    caughtFish = undefined;
    options.onerror?.(message);
    sendError(message, additionalInformation);
  };
  const retry = () => {
    state = FishingState.Retry;
  };

  return {
    get state() {
      return state;
    },
    get caughtFish() {
      return caughtFish;
    },
    set caughtFish(v: CaughtFish | undefined) {
      caughtFish = v;
    },
    idle,
    cast,
    bite,
    pull,
    miss,
    snap,
    pending,
    catchFish,
    error,
    retry,
  };
};
