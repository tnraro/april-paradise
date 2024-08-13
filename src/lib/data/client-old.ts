import { createClient } from "edgedb";

export const client = createClient({
  tlsSecurity: "insecure",
});
