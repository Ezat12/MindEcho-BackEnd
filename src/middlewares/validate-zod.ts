import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./async-handler.js";

export const validate = <T>(
  schema: ZodType<T>,
  source: "body" | "params" | "query" = "body",
) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
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

      res.locals[source] = result.data;
      next();
    },
  );
};
