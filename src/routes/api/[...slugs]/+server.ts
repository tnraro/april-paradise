import { app, locals } from "$lib/api/app";
import type { RequestEvent } from "./$types.js";

const handler = (event: RequestEvent) => {
  locals.set(event.request, event.locals);
  return app.handle(event.request);
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
