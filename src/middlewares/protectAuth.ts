import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/app-error.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { IAuthRepository } from "../modules/auth/repository/auth-repository.js";
import { asyncHandler } from "./async-handler.js";

export const protectAuth = (authRepository: IAuthRepository) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("ProtectAuth middleware invoked");
    const authToken = req.headers.authorization;

    if (!authToken) {
      throw new AppError("You are not authenticated", 401);
    }

    const token = authToken.split(" ")[1];

    if (!token) {
      throw new AppError("You are not authenticated", 401);
    }

    console.log("Token received:", token);

    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, env.JWT_ACCESS_SECRET_KEY);

      console.log("Decoded token:", decodedToken);
    } catch(error: any) {
      throw new AppError(`Invalid token: ${error.message}`, 401);
    }

    const user = await authRepository.findById(decodedToken.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    req.user = user;

    console.log("Authenticated user:", req.user);

    next();
  });
