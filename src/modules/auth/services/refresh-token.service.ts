import jwt from "jsonwebtoken";
import { env } from "config/env.js";
import { AppError } from "shared/errors/app-error.js";
import { redisClient } from "config/redis.js";
import type { ITokenProvider } from "../provider/token-provider.js";

type DecodedToken = {
  id: string;
  email: string;
  role: string;
};

export class RefreshTokenService {
  constructor(private readonly tokenProvider: ITokenProvider) {}

  async execute(refreshToken: string) {
    let decode: DecodedToken;

    try {
      decode = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET_KEY) as DecodedToken;
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }

    const tokenInRedis = await redisClient.get(`refresh:${decode.id}`);

    if (!tokenInRedis) {
      throw new AppError("Session expired", 401);
    }

    if (tokenInRedis !== refreshToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    const newAccessToken = this.tokenProvider.generateAccessToken({
      id: decode.id,
      email: decode.email,
      role: decode.role,
    });

    return newAccessToken;
  }
}
