import { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler = (callback: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(callback(req, res, next)).catch(next);
  }
};
