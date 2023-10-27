import { z } from "zod";

export const verifyUserSchema = z.object({
  email: z.string().trim().email(),
  code: z.string().trim().length(32),
});
