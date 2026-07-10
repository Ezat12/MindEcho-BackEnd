import bcrypt from "bcryptjs";
import { AppError } from "../../../shared/errors/app-error.js";
import type { User } from "../../users/domain/user.js";
import type { IAuthRepository } from "../repository/auth-repository.js";
import type { RegisterUserDTO } from "../dto/register-user.dto.js";
import type { ITokenProvider } from "../provider/token-provider.js";
import { redisClient } from "config/redis.js";
import { env } from "config/env.js";

export class RegisterService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(user: RegisterUserDTO): Promise<{
    registeredUser: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingUser = await this.authRepository.findByEmail(user.email);

    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const userData = {
      ...user,
      password: hashedPassword,
    };

    const registeredUser = await this.authRepository.register(userData);

    const accessToken = this.tokenProvider.generateAccessToken({
      id: registeredUser.id,
      email: registeredUser.email,
      role: registeredUser.role,
    });

    const refreshToken = this.tokenProvider.generateRefreshToken({
      id: registeredUser.id,
      email: registeredUser.email,
      role: registeredUser.role,
    });

    await redisClient.set(`refresh:${registeredUser.id}`, refreshToken, {
      EX: 60 * 60 * 24 * env.REDIS_EX_REFRESH_TOKEN,
    });

    return { registeredUser, accessToken, refreshToken };
  }
}
