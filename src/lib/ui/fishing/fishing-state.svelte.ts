import type { FishingData } from "$lib/data/sheets/model";
import { sleep } from "$lib/shared/util/sleep";
import { sendError } from "../error/send-error";

export const enum FishingState {
  Idle,
  Casting,
  Waiting,
  Biting,
  Pulling,
  Caught,
  Missing,
  Snapped,
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
>;
interface FishingOptions {
  oncast: (lure: string) => Promise<CaughtFish>;
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
  const cast = async (lure: string) => {
    if (state !== FishingState.Idle) return;
    state = FishingState.Casting;
    try {
      caughtFish = await options.oncast(lure);
    } catch (e) {
      if (typeof e === "string") {
        throw error(e);
      }
      error("무언가 잘못되었습니다", e);
    }
  };
  const wait = async () => {
    if (state !== FishingState.Casting) return;
    state = FishingState.Waiting;
    await sleep(1000);
    bite();
  };
  const bite = () => {
    if (state !== FishingState.Waiting) return;
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
  const catchFish = () => {
    if (state !== FishingState.Pulling) return;
    if (caughtFish == null) throw error("caught fish is null", "catchFish()");
    state = FishingState.Caught;
    options.oncatch?.(caughtFish);
  };
  const error = (message: string, additionalInformation?: unknown) => {
    caughtFish = undefined;
    options.onerror?.(message);
    sendError(message, additionalInformation);
  };

  return {
    get state() {
      return state;
    },
    get caughtFish() {
      return caughtFish;
    },
    idle,
    cast,
    wait,
    pull,
    miss,
    snap,
    catchFish,
    error,
  };
};
