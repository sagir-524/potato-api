import { ErrorRequestHandler, Request, Response } from "express";

export const defaultErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response
) => {
  res
    .status(500)
    .json({
      message: err.message || "Something went wrong. Please try again later.",
    });
};
