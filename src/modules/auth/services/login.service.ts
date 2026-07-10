import bcrypt from "bcryptjs";
import { AppError } from "../../../shared/errors/app-error.js";
import type { IAuthRepository } from "../repository/auth-repository.js";
import type { ITokenProvider } from "../provider/token-provider.js";
import type { User } from "../../users/domain/user.js";
import { redisClient } from "config/redis.js";
import { env } from "config/env.js";

export class LoginService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password is incorrect", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Email or password is incorrect", 400);
    }

    const accessToken = this.tokenProvider.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.tokenProvider.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await redisClient.set(`refresh:${user.id}`, refreshToken, {
      EX: 60 * 60 * 24 * env.REDIS_EX_REFRESH_TOKEN,
    });

    return { user, accessToken, refreshToken };
  }
}
