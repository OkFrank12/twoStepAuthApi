import { NextFunction, Response, Request } from "express";
import { ERROR_STATS, errorSetUp } from "./errorSetUp";

const errorSchema = (err: errorSetUp, res: Response) => {
  res.status(ERROR_STATS.NOT_FOUND).json({
    message: err.message,
    name: err.name,
    success: err.success,
    status: err.status,
    stack: err.stack,
    err,
  });
};

export const errorHandler = (
  err: errorSetUp,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorSchema(err, res);
};
