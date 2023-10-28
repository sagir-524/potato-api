import { Request, Response } from "express";
import { registerSchema } from "./schemas/register.schema";
import { asyncHandler } from "../../helpers/async-handler";
import { stripPassword } from "../../helpers/strip-password";
import { createUser, getUser } from "../users/users.service";
import {
  getTokenViaRefreshToken,
  getTokens,
  sendUserVerificationMail,
  verifyUser,
} from "./auth.service";
import { z } from "zod";
import { NotFoundException } from "../../exceptions/not-found.exception";
import { verifyUserSchema } from "./schemas/verify-user.schema";
import { BadRequestException } from "../../exceptions/bad-request.exception";
import { loginSchema } from "./schemas/login.schema";
import { compare } from "bcrypt";
import { User } from "../users/user.model";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

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
    res.sendStatus(204);
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
    throw new BadRequestException("Verification code is invalid or expired");
  }

  res.sendStatus(204);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = await loginSchema.parseAsync(req.body);
  const user = await getUser("email", email, undefined, false);

  if (user && !user.verifiedAt) {
    throw new BadRequestException("Email is not verified.", {
      verified: false,
    });
  }

  if (!user || !(await compare(password, user.password))) {
    throw new BadRequestException("Email or password didn't match");
  }

  const data = await getTokens(user);
  res.status(200).json({ ...data, user: stripPassword(data.user) });
});

export const profile = (req: Request, res: Response) => {
  const profile = stripPassword(req.user as User);
  res.status(200).json(profile);
};

export const refreshTokens = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = z.string().trim().parse(req.params.refreshToken);

    try {
      const data = await getTokenViaRefreshToken(refreshToken);
      res.status(200).json({ ...data, user: stripPassword(data.user) });
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new BadRequestException("Invalid token");
      }

      if (err instanceof TokenExpiredError) {
        throw new BadRequestException("Refresh token expired");
      }

      throw err;
    }
  }
);
