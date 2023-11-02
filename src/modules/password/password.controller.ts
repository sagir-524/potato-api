import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import { z } from "zod";
import { getUser } from "../users/users.service";
import { NotFoundException } from "../../exceptions/not-found.exception";
import { sendPasswordResetEmail, updateUserPassword } from "./password.service";
import { resetPasswordSchema } from "./schemas/reset-password.schema";

export const requestPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = await z
      .object({
        email: z.string().trim().email(),
      })
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
