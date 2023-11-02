import { z } from "zod";
import { getEmailValidator, getPasswordValidator } from "../../../helpers/schema-helpers";

export const loginSchema = z.object({
  email: getEmailValidator(),
  password: getPasswordValidator(),
});