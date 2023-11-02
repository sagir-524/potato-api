import { z } from "zod";
import {
  getEmailValidator,
  getPasswordValidator,
  refineConfirmPassword,
} from "../../../helpers/schema-helpers";

export const resetPasswordSchema = refineConfirmPassword(
  z.object({
    email: getEmailValidator(),
    cuid: z.string().trim().length(48),
    password: getPasswordValidator(),
    confirmPassword: getPasswordValidator(),
  })
);
