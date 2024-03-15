import { createClient, type Client } from "@liveblocks/client";
import { newStorage, type Presence, type Storage, type TRoom } from "./model";
import { roomConfig } from "./config";

let _client: Client;

export const getClient = () => {
  if (_client) return _client;
  return (_client = createClient({
    authEndpoint: "/api/liveblocks/auth",
  }));
};

export const enter = (client: Client, id: string) => {
  return client.enterRoom<Presence, Storage>(id, roomConfig);
};

export const getRoom = (id: string): { room: TRoom; leave: () => void } => {
  return enter(getClient(), id);
};
