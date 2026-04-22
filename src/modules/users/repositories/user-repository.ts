import type { CreateUserDTO } from "../dto/create-user.dto.js";
import type { User } from "../domain/user.js";
import type { UpdateUserDTO } from "../dto/update-user.dto.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  update(id: string, data: Partial<UpdateUserDTO>): Promise<User>;
  delete(id: string): Promise<void>;

  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
}
