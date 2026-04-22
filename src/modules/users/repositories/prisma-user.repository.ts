import { prisma } from "../../../config/prisma.js";
import type { CreateUserDTO } from "../dto/create-user.dto.js";
import type { User } from "../domain/user.js";
import type { IUserRepository } from "./user-repository.js";
import type { UpdateUserDTO } from "../dto/update-user.dto.js";

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.users.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserDTO): Promise<User> {
    return prisma.users.create({
      data: {
        ...data,
        avatarUrl: data.avatarUrl ?? null,
        bio: data.bio ?? null,
      },
    });
  }

  async update(id: string, data: Partial<UpdateUserDTO>): Promise<User> {
    return prisma.users.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.users.delete({ where: { id } });
  }

  async getAll(): Promise<User[]> {
    return prisma.users.findMany();
  }

  async getById(id: string): Promise<User | null> {
    return prisma.users.findUnique({
      where: { id },
    });
  }
}
