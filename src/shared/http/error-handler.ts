import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app-error.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.statusCode >= 500 ? "error" : "fail",
      statusCode: err.statusCode || 500,
      error: err.message,
      stack: err.stack,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: "error",
    statusCode: 500,
    error: "Internal server error",
    stack: err instanceof Error ? err.stack : undefined,
  });
};
