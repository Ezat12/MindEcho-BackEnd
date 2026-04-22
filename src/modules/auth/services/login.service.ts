import bcrypt from "bcryptjs";
import { AppError } from "../../../shared/errors/app-error.js";
import type { IAuthRepository } from "../repository/auth-repository.js";
import type { ITokenProvider } from "../provider/token-provider.js";
import type { User } from "../../users/domain/user.js";

export class LoginService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password is incorrect", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Email or password is incorrect", 400);
    }

    const token = this.tokenProvider.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}
