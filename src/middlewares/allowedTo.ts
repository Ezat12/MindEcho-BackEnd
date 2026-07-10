import type { Request, Response, NextFunction } from "express";
import { AppError } from "shared/errors/app-error.js";
import type { Role } from "@prisma/client";

export const allowedTo = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      next(new AppError("You are not allowed to perform this action", 403));
    }

    next();
  };
};
