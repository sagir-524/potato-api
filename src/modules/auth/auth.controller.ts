import { Request, Response } from "express";
import { registerSchema } from "./schemas/register.schema";
import { asyncHandler } from "../../helpers/async-handler";
import { stripPassword } from "../../helpers/strip-password";
import { createUser, getUser } from "../users/users.service";
import { sendUserVerificationMail, verifyUser } from "./auth.service";
import { z } from "zod";
import { NotFoundException } from "../../exceptions/not-found.exception";
import { verifyUserSchema } from "./schemas/verify-user.schema";
import { BadRequestException } from "../../exceptions/bad-request.exception";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await registerSchema.parseAsync(req.body);
  const newUser = await createUser(data);

  if (!newUser) {
    throw new Error("Unable to create new user");
  }

  await sendUserVerificationMail(newUser);
  res.status(201).json(stripPassword(newUser));
});

export const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const email = await z.string().trim().email().parseAsync(req.params.email);
    const user = await getUser("email", email, false, false);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    await sendUserVerificationMail(user);
    res.sendStatus(204)
  }
);

export const verify = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = await verifyUserSchema.parseAsync(req.params);
  const user = await getUser("email", email, false, false);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const verified = await verifyUser(user, code);
  if (!verified) {
    throw new BadRequestException('Verification code is invalid or expired');
  }
  
  res.sendStatus(204);
});
