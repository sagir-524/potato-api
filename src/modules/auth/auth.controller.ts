import { Request, Response } from "express";
import { registerSchema } from "./schemas/register.schema";
import { asyncHandler } from "../../helpers/async-handler";
import { db } from "../../db/db";
import { user } from "../users/users.model";
import { hash } from "../../helpers/hash";
import { InternalServerError } from "../../exceptions/internal-server-error";
import { stripPassword } from "../../helpers/strip-password";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await registerSchema.parseAsync(req.body);
  const newUser = await db
    .insert(user)
    .values([
      {
        name: data.name,
        email: data.email,
        password: await hash(data.password),
        verifiedAt: null,
      },
    ])
    .returning()
    .execute();

  if (!newUser.length) {
    throw new InternalServerError();
  }
  
  res.status(200).json(stripPassword(newUser[0]));
});
