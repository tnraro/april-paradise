import { ID, NAME, PASSWORD } from "$lib/shared/schema/auth";
import { z } from "zod";

export const schema = z.object({
  userId: ID,
  password: PASSWORD,
  name: NAME,
});
