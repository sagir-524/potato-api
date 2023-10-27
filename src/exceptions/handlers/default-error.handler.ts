import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { NotFoundException } from "../not-found.exception";
import { BadRequestException } from "../bad-request.exception";

export const defaultErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = 500;

  if (err instanceof NotFoundException) {
    status = 404;
  } else if (err instanceof BadRequestException) {
    status = 400;
  }

  return res.status(status).json({
    message: err.message || "Something went wrong. Please try again later.",
  });
};
