import { z } from "zod";
import {
  getPasswordValidator,
  refineConfirmPassword,
} from "../../../helpers/schema-helpers";

export const changePasswordSchema = refineConfirmPassword(
  z.object({
    oldPassword: getPasswordValidator(),
    password: getPasswordValidator(),
    confirmPassword: getPasswordValidator(),
  })
);
