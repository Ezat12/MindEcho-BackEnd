import type { User } from "../domain/user.js";
import type { IUserRepository } from "../repositories/user-repository.js";

export class GetAllUsersService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.getAll();
  }
}
