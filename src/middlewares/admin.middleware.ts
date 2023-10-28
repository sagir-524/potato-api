import { NextFunction, Request, Response } from "express";
import { User } from "../modules/users/user.model";
import { ForbiddenException } from "../exceptions/forbidder.exception";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    const { isAdmin, isSuperAdmin } = req.user as User;

    if (isAdmin || isSuperAdmin) {
      return next();
    }
  }

  return next(
    new ForbiddenException(
      "You do not have sufficient permisions to perform this action."
    )
  );
};
