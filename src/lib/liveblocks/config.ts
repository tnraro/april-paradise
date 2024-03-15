import { newStorage } from "./model";

export const roomConfig = {
  initialPresence: {
    focusedElement: "",
  },
  initialStorage: newStorage(),
  autoConnect: false,
};
