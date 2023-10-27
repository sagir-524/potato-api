import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorLogHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  next(err);
};
