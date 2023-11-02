import { z } from "zod";

export const getEmailValidator = () => z.string().trim().email();
export const getPasswordValidator = () => z.string().trim().min(6).max(16);

export const refineConfirmPassword = <
  T extends { password: string; confirmPassword: string }
>(
  schema: z.ZodType<T>
) => {
  return schema.refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    {
      message: "Password confirmation didn't match",
      path: ["confirmPassword"],
    }
  );
};
