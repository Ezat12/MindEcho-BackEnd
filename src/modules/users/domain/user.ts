import type { Role } from "@prisma/client";

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
