import { env } from "../../../config/env.js";
import { AppError } from "../../../shared/errors/app-error.js";
import type { ITokenProvider } from "./token-provider.js";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export class TokenJWT implements ITokenProvider {
  generateAccessToken(payload: object): string {
    const secretKey = env.JWT_ACCESS_SECRET_KEY;

    if (!secretKey) {
      throw new AppError(
        "JWT access secret key is not defined in environment variables.",
        500,
      );
    }

    return jwt.sign(payload, secretKey, {
      expiresIn: env.JWT_EXPIRES_ACCESS_IN as StringValue,
    });
  }

  generateRefreshToken(payload: object): string {
    const secretKey = env.JWT_REFRESH_SECRET_KEY;
    if (!secretKey) {
      throw new AppError(
        "JWT refresh secret key is not defined in environment variables.",
        500,
      );
    }

    return jwt.sign(payload, secretKey, {
      expiresIn: env.JWT_EXPIRES_REFRESH_IN as StringValue,
    });
  }
}
