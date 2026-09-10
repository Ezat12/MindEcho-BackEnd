import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import type { User } from "../../src/modules/users/domain/user";
import type { ITokenProvider } from "../../src/modules/auth/provider/token-provider";
import type { IAuthRepository } from "../../src/modules/auth/repository/auth-repository";
import type { RegisterUserDTO } from "../../src/modules/auth/dto/register-user.dto";

jest.unstable_mockModule("config/redis.js", () => ({
  redisClient: {
    set: jest.fn<() => Promise<string>>().mockResolvedValue("OK"),
  },
}));

const { RegisterService } =
  await import("../../src/modules/auth/services/register.service");

describe("RegisterServices", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockFindByEmail = jest.fn<() => Promise<User | null>>();
  const mockRegister = jest.fn<() => Promise<User>>();

  const mockAuthRepository = {
    findByEmail: mockFindByEmail,
    register: mockRegister,
  } as unknown as IAuthRepository;

  const mockTokenProvider = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
  } as unknown as ITokenProvider;

  const service = new RegisterService(mockAuthRepository, mockTokenProvider);

  it("Should return error when email is already in use", async () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      password: "password",
      name: "Test User",
      role: "CLIENT",
      bio: "some bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockFindByEmail.mockResolvedValue(mockUser);

    const userSender = {
      email: "test@example.com",
      password: "12234",
      name: "Test User",
    } as RegisterUserDTO;

    const result = service.execute(userSender);

    await expect(result).rejects.toThrow("Email already registered");
  });
});
