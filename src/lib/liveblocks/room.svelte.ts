import { delay } from "$lib/shared/delay";
import {
  LiveList,
  type LiveObject,
  type Status,
  type User
} from "@liveblocks/client";
import { getRoom } from "./client";
import type { LocalUserMeta, Presence, Runner, Storage, UserMeta } from "./model";

export const useRoom = (roomId: string) => {
  const { room, leave } = getRoom(roomId);

  $effect(() => {
    room.connect();
  });

  return {
    get room() {
      return room;
    },
    dispose: () => {
      leave();
    },
  };
};

export const useStatus = (roomId: string) => {
  const { room } = getRoom(roomId);
  let status = $state<Status>(room.getStatus());
  const dispose = room.events.status.subscribe((value) => {
    status = value;
  });
  return {
    get value() {
      switch (status) {
        case "initial":
          return "대기중";
        case "connecting":
          return "연결중";
        case "connected":
          return "연결됨";
        case "reconnecting":
          return "재연결 시도중";
        case "disconnected":
          return "연결 끊김";
      }
    },
    dispose,
  };
};

export const usePresence = (options?: {
  enter?: (user: User<Presence, UserMeta>) => LocalUserMeta;
  leave?: (user: User<Presence, UserMeta>) => void;
}) => {
  const { room } = getRoom("test");
  let me = $state.frozen<Presence>(room.getPresence());
  let others = $state.frozen<User<Presence, UserMeta>[]>([]);
  others = room.getOthers();

  const localMeta = new Map<string, { color: string }>();

  const disposes = [
    room.events.myPresence.subscribe((p) => {
      me = p;
    }),
    room.events.others.subscribe((e) => {
      others = e.others;

      if (e.type === "enter") {
        if (e.user.id && options?.enter) {
          localMeta.set(e.user.id, options.enter(e.user));
        }
      } else if (e.type === "leave") {
        if (e.user.id) {
          localMeta.delete(e.user.id);
          options?.leave?.(e.user);
        }
      }
    }),
  ];
  let patches: Partial<Presence> | undefined = undefined;

  return {
    get me() {
      return me;
    },
    get others() {
      return others;
    },
    update(patch: Partial<Presence>) {
      patches = {
        ...patches,
        ...patch,
      };
      delay(200).then(() => {
        if (patches == null) return;
        room.updatePresence(patches);
        patches = undefined;
      });
    },
    getLocalMeta: (id: string | undefined) => localMeta.get(id!),
    dispose: () => disposes.forEach((dispose) => dispose()),
  };
};

/**
 * @deprecated
 */
export const useStorage = (roomId: string) => {
  const { room } = getRoom(roomId);
  const disposes: (() => void)[] = [];

  let storage = $state<LiveObject<Storage> | null>(null);
  let runners = $state<{ v: LiveList<LiveObject<Runner>> | null }>({ v: null });

  room.getStorage();
  room.events.storageDidLoad.subscribeOnce(() => {
    storage = room.getStorageSnapshot()!;
    runners = { v: storage.get("runners") };
    disposes.push(
      room.subscribe(storage.get("runners"), () => {
        runners = { v: runners.v };
      }),
    );
  });

  return {
    get value() {
      return storage;
    },
    get runners() {
      return runners.v;
    },
    dispose: () => {
      disposes.forEach((dispose) => dispose());
    },
  };
};

export const useRunners = (roomId: string) => {
  const { room } = getRoom(roomId);
  let mut: LiveList<LiveObject<Runner>>;
  let runners = $state.frozen<Runner[] | null>(null);
  let dispose = () => {};

  room.getStorage().then(({ root }) => {
    mut = root.get("runners");
    runners = mut.toImmutable();
    dispose = room.subscribe(
      mut,
      (e) => {
        console.log(53, mut, e);
        runners = mut.toImmutable();
      },
      { isDeep: true },
    );
  });

  return {
    get value() {
      return runners;
    },
    mut() {
      return mut;
    },
    dispose,
  };
};
