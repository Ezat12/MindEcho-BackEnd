import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate = <T>(
  schema: ZodType<T>,
  source: "body" | "params" | "query" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        message: "Validation error",
        errors: formattedErrors,
      });
    }

    req[source] = result.data;
    next();
  };
};
