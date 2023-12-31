import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { NotFoundException } from "../not-found.exception";
import { BadRequestException } from "../bad-request.exception";
import { ForbiddenException } from "../forbidder.exception";

export const defaultErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = 500;
  let extra: any | undefined;

  if (err instanceof NotFoundException) {
    status = 404;
  } else if (err instanceof BadRequestException) {
    status = 400;
    extra = err.extra;
  } else if (err instanceof ForbiddenException) {
    status = 403;
  }

  res.status(status).json({
    message: err.message || "Something went wrong. Please try again later.",
    extra
  });
};
