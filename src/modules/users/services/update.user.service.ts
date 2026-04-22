import { AppError } from "../../../shared/errors/app-error.js";
import type { User } from "../domain/user.js";
import type { UpdateUserDTO } from "../dto/update-user.dto.js";
import type { IUserRepository } from "../repositories/user-repository.js";

export class UpdateUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return this.userRepository.update(id, data);
  }
}
