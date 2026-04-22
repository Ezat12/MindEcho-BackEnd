import { prisma } from "../../../config/prisma.js";
import type { User } from "../../users/domain/user.js";
import type { RegisterUserDTO } from "../dto/register-user.dto.js";
import type { IAuthRepository } from "./auth-repository.js";

export class PrismaAuthRepository implements IAuthRepository {
  findByEmail(email: string): Promise<User | null> {
    return prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  findById(id: string): Promise<User | null> {
    return prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  register(data: RegisterUserDTO): Promise<User> {
    const { name, email, password, bio, avatarUrl, role } = data;

    return prisma.users.create({
      data: {
        name,
        email,
        password,
        role: role || "CLIENT",
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      },
    });
  }
}
