import { z } from "zod";
import { db } from "../../../db";
import { userModel } from "../../users/user.model";
import { eq, sql } from "drizzle-orm";
import {
  getEmailValidator,
  getPasswordValidator,
  refineConfirmPassword,
} from "../../../helpers/schema-helpers";

export const registerSchema = refineConfirmPassword(
  z.object({
    name: z.string().trim().min(3).max(255),
    email: getEmailValidator().refine(
      async (email) => {
        const res = await db
          .select({ count: sql<number>`count(*)` })
          .from(userModel)
          .where(eq(userModel.email, email))
          .execute();

        return res[0].count === 0;
      },
      { message: "Email already exists" }
    ),
    password: getPasswordValidator(),
    confirmPassword: getPasswordValidator(),
  })
);
