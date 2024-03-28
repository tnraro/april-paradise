import { ID, PASSWORD } from "$lib/shared/schema/auth";
import { z } from "zod";

export const schema = z.object({
  id: ID,
  password: PASSWORD,
  code: z.string().uuid(),
});
