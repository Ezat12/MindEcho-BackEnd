import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/app-error.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { IAuthRepository } from "../modules/auth/repository/auth-repository.js";
import { asyncHandler } from "./async-handler.js";

export const protectAuth = (authRepository: IAuthRepository) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers.authorization;

    if (!authToken) {
      throw new AppError("You are not authenticated", 401);
    }

    const token = authToken.split(" ")[1];

    if (!token) {
      throw new AppError("You are not authenticated", 401);
    }

    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, env.JWT_SECRET_KEY);
    } catch {
      throw new AppError("Invalid token", 401);
    }

    const user = await authRepository.findById(decodedToken.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    req.user = user;

    next();
  });
