import { getCurrentAdminProfile } from "$edgedb/queries";
import { error } from "@sveltejs/kit";
import type { z } from "zod";

export const guardAdmin = async <T extends { locals: App.Locals }>(event: T) => {
  const session = event.locals.auth.session;
  const admin = await getCurrentAdminProfile(session.client);
  if (admin == null) {
    error(401, "Unauthorized");
  }
  return event;
};

export const validateBody = <S extends z.ZodTypeAny = z.ZodNever>(schema: S) => {
  return async <Event extends { request: Request }>(event: Event) => {
    const body = await event.request.json();
    const result = schema.safeParse(body as unknown);
    if (!result.success) {
      error(400, result.error.errors.map((error) => error.message).join("\n"));
    }
    return {
      ...event,
      body: result.data as z.infer<S>,
    };
  };
};

export const logError =
  (id: string) =>
  <T>(e: T) => {
    console.error(`err(${id}):`, e);
    throw e;
  };
