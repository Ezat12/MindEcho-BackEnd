import { env } from "../../../config/env.js";
import { AppError } from "../../../shared/errors/app-error.js";
import type { ITokenProvider } from "./token-provider.js";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export class TokenJWT implements ITokenProvider {
  generateToken(payload: object): string {
    const secretKey = env.JWT_SECRET_KEY;

    if (!secretKey) {
      throw new AppError(
        "JWT secret key is not defined in environment variables.",
        500,
      );
    }

    return jwt.sign(payload, secretKey, {
      expiresIn: env.JWT_EXPIRES_IN as StringValue,
    });
  }
}
