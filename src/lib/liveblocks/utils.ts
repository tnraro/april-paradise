import { getRoom } from "./client";

export const batch = (roomId: string, fn: () => void) => {
  getRoom(roomId).room.batch(fn);
};
