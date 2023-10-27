import { z } from "zod";
import { db } from "../../../db";
import { user } from "../../users/users.model";
import { eq } from "drizzle-orm";

export const registerSchema = z
  .object({
    name: z.string().trim().min(3).max(255),
    email: z.string().trim().email(),
    password: z.string().trim().min(6).max(16),
    confirmPassword: z.string().trim().min(6).max(16),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password confirmation didn't match",
    path: ["confirmPassword"],
  })
  .refine(
    async ({ email }) => {
      const res = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, email))
        .execute();
      return res.length === 0;
    },
    {
      message: "Email already exists",
      path: ["email"],
    }
  );
