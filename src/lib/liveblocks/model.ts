import { LiveList, type BaseUserMeta, type Room, LiveObject } from "@liveblocks/client";

export type Presence = {
  focusedElement: string;
};
export type UserMeta = {} & BaseUserMeta;
export type LocalUserMeta = {
  color: string;
};

export type Runner = {
  id: string;
  name: string;
  chips: number;
  tokens: number;
};
export const newRunner = (): LiveObject<Runner> =>
  new LiveObject({
    id: crypto.randomUUID(),
    name: "",
    chips: 0,
    tokens: 0,
  });

export type RouletteItem = {
  id: string;
  reward: string;
  p: number;
};
export const newRouletteItem = (): RouletteItem => ({
  id: crypto.randomUUID(),
  reward: "",
  p: 0,
});
export type RouletteSetting = {
  items: LiveList<RouletteItem>;
};

export type Storage = {
  runners: LiveList<LiveObject<Runner>>;
  rouletteSettings: LiveObject<RouletteSetting>;
};
export const newStorage = (): Storage => {
  return {
    runners: new LiveList(),
    rouletteSettings: new LiveObject({
      items: new LiveList(),
    }),
  };
};

export type TRoom = Room<Presence, Storage, UserMeta, never>;
