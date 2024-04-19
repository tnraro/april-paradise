import * as Sentry from "@sentry/browser";

export const sendError = (message: string, additionalInformation?: unknown) => {
  Sentry.captureException(
    new Error(message, {
      cause: additionalInformation,
    }),
  );
  navigator.sendBeacon(
    "/api/errors",
    JSON.stringify({ message, additionalInformation }),
  );
  throw new Error(message);
};
