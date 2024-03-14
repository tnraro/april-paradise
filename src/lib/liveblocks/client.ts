import { createClient, type Client } from "@liveblocks/client";

let _client: Client;

export const getClient = () => {
  if (_client) return _client;
  return (_client = createClient({
    authEndpoint: "/api/liveblocks/auth",
  }));
};

export const getRoom = (id: string) => {
  return getClient().enterRoom(id, {
    initialPresence: {},
    initialStorage: {
      users: [],
    },
  });
};
