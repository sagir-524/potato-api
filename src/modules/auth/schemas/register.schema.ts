import { z } from "zod";

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
  });
