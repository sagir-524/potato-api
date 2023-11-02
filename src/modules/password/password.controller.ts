import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import { z } from "zod";
import { getUser, updateUser } from "../users/users.service";
import { NotFoundException } from "../../exceptions/not-found.exception";
import { sendPasswordResetEmail, updateUserPassword } from "./password.service";
import { resetPasswordSchema } from "./schemas/reset-password.schema";
import { getPasswordValidator } from "../../helpers/schema-helpers";
import { User } from "../users/user.model";
import { changePasswordSchema } from "./schemas/change-passsword.schema";
import { compare } from "bcrypt";
import { hashPassword } from "../../helpers/common";

export const requestPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = await z
      .object({ email: getPasswordValidator() })
      .parseAsync(req.body);

    const user = await getUser("email", email);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    await sendPasswordResetEmail(user);
    res.sendStatus(204);
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const body = await resetPasswordSchema.parseAsync(req.body);
    const user = await getUser("email", body.email);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const updated = await updateUserPassword(user, body.cuid, body.password);
    if (!updated) {
      throw new Error();
    }

    res.sendStatus(204);
  }
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const { password } = await changePasswordSchema
      .refine((data) => compare(data.oldPassword, user.password), {
        message: "Password didn't match.",
        path: ["oldPassword"],
      })
      .parseAsync(req.body);

    await updateUser(user, { password: await hashPassword(password) });
    res.sendStatus(204);
  }
);
