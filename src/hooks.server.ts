import { lucia } from "$lib/data/auth";
import { client, single } from "$lib/data/client";
import { users } from "$lib/data/schema";
import { initData } from "$lib/data/sheets/sheets";
import { type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { eq } from "drizzle-orm";

const logger: Handle = ({ event, resolve }) => {
  console.info(
    event.request.method,
    event.request.url,
    event.locals.user?.name,
    new Date().toISOString(),
  );
  return resolve(event);
};

const auth: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (sessionId == null) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  }
  if (session == null) {
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  }
  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};

const authUtils: Handle = async ({ event, resolve }) => {
  event.locals.auth = {
    async signUp(info) {
      const { id } = single(
        await client
          .insert(users)
          .values({
            ...info,
            password: await Bun.password.hash(info.password),
          })
          .returning({ id: users.id }),
      ) as { id: string };

      const session = await lucia.createSession(id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        ...sessionCookie.attributes,
        path: "/",
      });
    },
    async signIn(info) {
      const user = single(
        await client
          .select({
            id: users.id,
            password: users.password,
          })
          .from(users)
          .where(eq(users.userId, info.userId)),
      );
      if (user == null) return false;
      if (!(await Bun.password.verify(info.password, user.password))) {
        return false;
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        ...sessionCookie.attributes,
        path: "/",
      });
      return true;
    },
    async signOut() {
      if (event.locals.session == null) return;
      await lucia.invalidateSession(event.locals.session.id);
      const sessionCookie = lucia.createBlankSessionCookie();
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        ...sessionCookie.attributes,
        path: "/",
      });
    },
  };
  return resolve(event);
};

export const handle = sequence(auth, authUtils, logger);

initData(client);
