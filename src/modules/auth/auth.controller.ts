import { Request, Response } from "express";
import { registerSchema } from "./schemas/register.schema";
import { asyncHandler } from "../../helpers/async-handler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await registerSchema.parseAsync(req.body);
  res.status(200).json(data);
});
