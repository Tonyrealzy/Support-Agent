import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  logger.error(`[ERROR] ${req.method} ${req.url} -> ${message}`);
  res.status(status).json({ success: false, message });
};
