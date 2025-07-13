import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(result.error); // Forward to global error handler
    }

    // Attach validated data to request object if needed
    req.body = result.data;
    next();
  };
};
