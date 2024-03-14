import { env } from "$env/dynamic/private";
import { Liveblocks } from "@liveblocks/node";

export const liveblocks = new Liveblocks({
  secret: env.LIVEBLOCKS_KEY,
});
