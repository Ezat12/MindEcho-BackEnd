import type { User } from "../../users/domain/user.js";
import type { RegisterUserDTO } from "../dto/register-user.dto.js";

export interface IAuthRepository {
  findByEmail: (email: string) => Promise<User | null>;
  register: (user: RegisterUserDTO) => Promise<User>;
}
