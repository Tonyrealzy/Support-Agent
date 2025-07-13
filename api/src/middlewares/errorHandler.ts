import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({
      status: "failure",
      message: "Validation failed",
      errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(status).json({
      status,
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  logger.error(`[ERROR] ${req.method} ${req.url} -> ${message}`);
  res.status(status).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
