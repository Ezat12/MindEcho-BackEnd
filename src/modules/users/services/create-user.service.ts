import { AppError } from "../../../shared/errors/app-error.js";
import type { CreateUserDTO } from "../dto/create-user.dto.js";
import type { User } from "../domain/user.js";
import type { IUserRepository } from "../repositories/user-repository.js";

export class CreateUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    return await this.userRepository.create(data);
  }
}
