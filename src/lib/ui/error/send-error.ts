export const sendError = (message: string, additionalInformation?: unknown) => {
  navigator.sendBeacon(
    "/api/errors",
    JSON.stringify({ message, additionalInformation }),
  );
  throw new Error(message);
};
