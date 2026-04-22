import type { IUserRepository } from "../repositories/user-repository.js";
import { AppError } from "../../../shared/errors/app-error.js";
import type { User } from "../domain/user.js";

export class GetByIdUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}
