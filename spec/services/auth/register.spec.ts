import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import type { User } from "../../../src/modules/users/domain/user";
import type { ITokenProvider } from "../../../src/modules/auth/provider/token-provider";
import type { IAuthRepository } from "../../../src/modules/auth/repository/auth-repository";
import type { RegisterUserDTO } from "../../../src/modules/auth/dto/register-user.dto";

const mockRedisSet =
  jest.fn<
    (key: string, value: string, options: { EX: number }) => Promise<string>
  >();
jest.unstable_mockModule("config/redis.js", () => ({
  redisClient: {
    set: mockRedisSet,
  },
}));

const mockHash = jest.fn<(password: string, salt: number) => Promise<string>>();

jest.unstable_mockModule("bcryptjs", () => ({
  __esModule: true,
  default: {
    hash: mockHash,
  },
}));

const { RegisterService } =
  await import("../../../src/modules/auth/services/register.service");

describe("RegisterServices", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockFindByEmail = jest.fn<() => Promise<User | null>>();
  const mockRegister = jest.fn<(userData: RegisterUserDTO) => Promise<User>>();

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

  it("Should hash password before registering user", async () => {
    const userSender = {
      email: "test@example.com",
      password: "12234",
      name: "Test User",
    } as RegisterUserDTO;

    mockFindByEmail.mockResolvedValue(null);

    mockHash.mockResolvedValue("hashed_password");

    mockRegister.mockResolvedValue({
      id: "1",
      email: "test@example.com",
      password: "hashed_password",
      name: "Test User",
      role: "CLIENT",
      bio: "some bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await service.execute(userSender);

    expect(mockHash).toHaveBeenCalledWith("12234", 10);

    expect(mockRegister).toHaveBeenCalledWith({
      ...userSender,
      password: "hashed_password",
    });
  });

  it("Should return error when repository register fails", async () => {
    const userSender = {
      email: "test@example.com",
      password: "12234",
      name: "Test User",
    } as RegisterUserDTO;

    mockFindByEmail.mockResolvedValue(null);

    mockHash.mockResolvedValue("hashed_password");

    mockRegister.mockRejectedValue(new Error("Database error"));

    await expect(service.execute(userSender)).rejects.toThrow("Database error");

    expect(mockRegister).toHaveBeenCalledWith({
      ...userSender,
      password: "hashed_password",
    });
  });

  it("Should return error when access token generation fails", async () => {
    const userSender = {
      email: "test@example.com",
      password: "12234",
      name: "Test User",
    } as RegisterUserDTO;

    const registeredUser = {
      id: "1",
      email: "test@example.com",
      password: "hashed_password",
      name: "Test User",
      role: "CLIENT",
      bio: "some bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockFindByEmail.mockResolvedValue(null);
    mockHash.mockResolvedValue("hashed_password");
    mockRegister.mockResolvedValue(registeredUser);

    (mockTokenProvider.generateAccessToken as jest.Mock).mockImplementation(
      () => {
        throw new Error("Access token error");
      },
    );

    await expect(service.execute(userSender)).rejects.toThrow(
      "Access token error",
    );
  });

  it("Should return error when refresh token generation fails", async () => {
    const userSender = {
      email: "test@example.com",
      password: "12234",
      name: "Test User",
    } as RegisterUserDTO;

    const registeredUser = {
      id: "1",
      email: "test@example.com",
      password: "hashed_password",
      name: "Test User",
      role: "CLIENT",
      bio: "some bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockFindByEmail.mockResolvedValue(null);
    mockHash.mockResolvedValue("hashed_password");
    mockRegister.mockResolvedValue(registeredUser);

    (mockTokenProvider.generateAccessToken as jest.Mock).mockReturnValue(
      "access-token",
    );

    (mockTokenProvider.generateRefreshToken as jest.Mock).mockImplementation(
      () => {
        throw new Error("Refresh token error");
      },
    );

    await expect(service.execute(userSender)).rejects.toThrow(
      "Refresh token error",
    );
  });

  it("Should return error when saving refresh token in Redis fails", async () => {
    const userSender = {
      email: "test@example.com",
      password: "12234",
      name: "Test User",
    } as RegisterUserDTO;

    const registeredUser = {
      id: "1",
      email: "test@example.com",
      password: "hashed_password",
      name: "Test User",
      role: "CLIENT",
      bio: "some bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockFindByEmail.mockResolvedValue(null);
    mockHash.mockResolvedValue("hashed_password");
    mockRegister.mockResolvedValue(registeredUser);

    (mockTokenProvider.generateAccessToken as jest.Mock).mockReturnValue(
      "access-token",
    );

    (mockTokenProvider.generateRefreshToken as jest.Mock).mockReturnValue(
      "refresh-token",
    );

    mockRedisSet.mockRejectedValue(new Error("Redis error"));

    await expect(service.execute(userSender)).rejects.toThrow("Redis error");
  });

  it("Should register user and return tokens successfully", async () => {
    const userSender = {
      email: "test@example.com",
      password: "12234",
      name: "Test User",
    } as RegisterUserDTO;

    const registeredUser = {
      id: "1",
      email: "test@example.com",
      password: "hashed_password",
      name: "Test User",
      role: "CLIENT",
      bio: "some bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockFindByEmail.mockResolvedValue(null);
    mockHash.mockResolvedValue("hashed_password");
    mockRegister.mockResolvedValue(registeredUser);

    (mockTokenProvider.generateAccessToken as jest.Mock).mockReturnValue(
      "access-token",
    );

    (mockTokenProvider.generateRefreshToken as jest.Mock).mockReturnValue(
      "refresh-token",
    );

    mockRedisSet.mockResolvedValue("OK");

    const result = await service.execute(userSender);

    expect(result).toEqual({
      registeredUser,
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    expect(mockHash).toHaveBeenCalledWith("12234", 10);

    expect(mockRegister).toHaveBeenCalledWith({
      ...userSender,
      password: "hashed_password",
    });

    expect(mockTokenProvider.generateAccessToken).toHaveBeenCalledWith({
      id: registeredUser.id,
      email: registeredUser.email,
      role: registeredUser.role,
    });

    expect(mockTokenProvider.generateRefreshToken).toHaveBeenCalledWith({
      id: registeredUser.id,
      email: registeredUser.email,
      role: registeredUser.role,
    });

    expect(mockRedisSet).toHaveBeenCalledWith(
      `refresh:${registeredUser.id}`,
      "refresh-token",
      {
        EX: expect.any(Number),
      },
    );
  });
});
