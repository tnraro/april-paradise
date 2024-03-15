import { liveblocks } from "$lib/api/liveblocks";
import { createClient } from "@liveblocks/client";
import { enter } from "./client";

const client = createClient({
  authEndpoint: async (room) => {
    console.log(room);
    const session = liveblocks.prepareSession("_SERVICE");
    session.allow(room!, session.FULL_ACCESS);
    const { body } = await session.authorize();
    return JSON.parse(body);
  },
});

const { room } = enter(client, "test");
room.connect();
const { root } = await room.getStorage();
export const storage = { value: root };
room.subscribe(root, (root) => {
  storage.value = root;
});

// export const modifyStorage = async <R>(
//   roomId: string,
//   changes: (root: LiveObject<Storage>) => Promise<R> | R,
// ) => {
//   try {
//     console.log(1);
//     const { room, leave } = enter(serverClient, roomId);
//     console.log(2);
//     console.log(room.getStatus());
//     console.log(room.getStorageStatus());
//     room.subscribe("status", (status) => console.log("status", status));
//     room.subscribe("error", (error) => console.error("error", error));
//     const { root } = await room.getStorage();
//     console.log(3);
//     let res: R = null!;
//     room.batch(async () => {
//       console.log(4);
//       res = await changes(root);
//       console.log(5);
//     });
//     if (room.getStorageStatus() !== "synchronized") {
//       await room.events.storageStatus.waitUntil((status) => status === "synchronized");
//     }
//     leave();
//     return res as R;
//   } catch (error) {
//     console.error(error);
//   }
// };

// // await modifyStorage("test", (root) => {
// //   console.log(root);
// // });
