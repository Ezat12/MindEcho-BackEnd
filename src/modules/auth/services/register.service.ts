import bcrypt from "bcryptjs";
import { AppError } from "../../../shared/errors/app-error.js";
import type { User } from "../../users/domain/user.js";
import type { IAuthRepository } from "../repository/auth-repository.js";
import type { RegisterUserDTO } from "../dto/register-user.dto.js";
import type { ITokenProvider } from "../provider/token-provider.js";

export class RegisterService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(
    user: RegisterUserDTO,
  ): Promise<{ registeredUser: User; token: string }> {
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

    const token = this.tokenProvider.generateToken({
      id: registeredUser.id,
      email: registeredUser.email,
      role: registeredUser.role,
    });

    return { registeredUser, token };
  }
}
