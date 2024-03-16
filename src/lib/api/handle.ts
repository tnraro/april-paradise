import { type RequestEvent, json } from "@sveltejs/kit";

export const handle =
  (handler: (event: RequestEvent, set: ResponseInit) => Promise<unknown>) =>
  async (event: RequestEvent) => {
    const set = {};
    const res = await handler(event, set);
    return json(res, set);
  };
