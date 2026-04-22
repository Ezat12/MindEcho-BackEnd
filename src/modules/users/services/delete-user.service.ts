import { AppError } from "../../../shared/errors/app-error.js";
import type { IUserRepository } from "../repositories/user-repository.js";

export class DeleteUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.userRepository.delete(id);
  }
}
