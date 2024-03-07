import { randomBytes, createHash } from "node:crypto";

export const generatePKCE = () => {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
};
