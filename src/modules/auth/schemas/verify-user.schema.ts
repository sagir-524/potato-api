import { z } from "zod";
import { getEmailValidator } from "../../../helpers/schema-helpers";

export const verifyUserSchema = z.object({
  email: getEmailValidator(),
  code: z.string().trim().length(32),
});
