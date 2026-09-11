import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import type { User } from "../../src/modules/users/domain/user";
import type { ITokenProvider } from "../../src/modules/auth/provider/token-provider";
import type { IAuthRepository } from "../../src/modules/auth/repository/auth-repository";

const mockRedisSet =
  jest.fn<
    (key: string, value: string, options: { EX: number }) => Promise<string>
  >();

jest.unstable_mockModule("config/redis.js", () => ({
  redisClient: {
    set: mockRedisSet,
  },
}));

const mockCompare =
  jest.fn<(password: string, hash: string) => Promise<boolean>>();

jest.unstable_mockModule("bcryptjs", () => ({
  __esModule: true,
  default: {
    compare: mockCompare,
  },
}));

const { LoginService } =
  await import("../../src/modules/auth/services/login.service");

describe("LoginService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockFindByEmail = jest.fn<(email: string) => Promise<User | null>>();

  const mockAuthRepository = {
    findByEmail: mockFindByEmail,
  } as unknown as IAuthRepository;

  const mockTokenProvider = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
  } as unknown as ITokenProvider;

  const service = new LoginService(mockAuthRepository, mockTokenProvider);

  it("Should return error when user does not exist", async () => {
    mockFindByEmail.mockResolvedValue(null);

    await expect(service.execute("test@example.com", "123456")).rejects.toThrow(
      "Email or password is incorrect",
    );

    expect(mockFindByEmail).toHaveBeenCalledWith("test@example.com");
    expect(mockCompare).not.toHaveBeenCalled();
  });

  it("Should return error when password is incorrect", async () => {
    const user = {
      id: "1",
      email: "test@example.com",
      password: "hashed_password",
      name: "Test User",
      role: "CLIENT",
      bio: "some bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockFindByEmail.mockResolvedValue(user);
    mockCompare.mockResolvedValue(false);

    await expect(
      service.execute("test@example.com", "wrong-password"),
    ).rejects.toThrow("Email or password is incorrect");

    expect(mockFindByEmail).toHaveBeenCalledWith("test@example.com");

    expect(mockCompare).toHaveBeenCalledWith(
      "wrong-password",
      "hashed_password",
    );

    expect(mockTokenProvider.generateAccessToken).not.toHaveBeenCalled();

    expect(mockTokenProvider.generateRefreshToken).not.toHaveBeenCalled();

    expect(mockRedisSet).not.toHaveBeenCalled();
  });

  it("Should return error when password comparison fails", async () => {
    const user = {
      id: "1",
      email: "test@example.com",
      password: "hashed_password",
      name: "Test User",
      role: "CLIENT",
      bio: "some bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockFindByEmail.mockResolvedValue(user);

    mockCompare.mockRejectedValue(new Error("Password comparison error"));

    await expect(service.execute("test@example.com", "123456")).rejects.toThrow(
      "Password comparison error",
    );

    expect(mockCompare).toHaveBeenCalledWith("123456", "hashed_password");

    expect(mockTokenProvider.generateAccessToken).not.toHaveBeenCalled();

    expect(mockTokenProvider.generateRefreshToken).not.toHaveBeenCalled();

    expect(mockRedisSet).not.toHaveBeenCalled();
  });

  it("Should return error when access token generation fails", async () => {
    const user = {
      id: "1",
      email: "test@example.com",
      password: "hashed_password",
      name: "Test User",
      role: "CLIENT",
      bio: "some bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockFindByEmail.mockResolvedValue(user);
    mockCompare.mockResolvedValue(true);

    (mockTokenProvider.generateAccessToken as jest.Mock).mockImplementation(
      () => {
        throw new Error("Access token error");
      },
    );

    await expect(service.execute("test@example.com", "123456")).rejects.toThrow(
      "Access token error",
    );

    expect(mockCompare).toHaveBeenCalledWith("123456", "hashed_password");

    expect(mockTokenProvider.generateAccessToken).toHaveBeenCalledWith({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    expect(mockTokenProvider.generateRefreshToken).not.toHaveBeenCalled();

    expect(mockRedisSet).not.toHaveBeenCalled();
  });

  it("Should return error when refresh token generation fails", async () => {
    const user = {
      id: "1",
      email: "test@example.com",
      password: "hashed_password",
      name: "Test User",
      role: "CLIENT",
      bio: "some bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockFindByEmail.mockResolvedValue(user);
    mockCompare.mockResolvedValue(true);

    (mockTokenProvider.generateAccessToken as jest.Mock).mockReturnValue(
      "access-token",
    );

    (mockTokenProvider.generateRefreshToken as jest.Mock).mockImplementation(
      () => {
        throw new Error("Refresh token error");
      },
    );

    await expect(service.execute("test@example.com", "123456")).rejects.toThrow(
      "Refresh token error",
    );

    expect(mockTokenProvider.generateAccessToken).toHaveBeenCalledWith({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    expect(mockTokenProvider.generateRefreshToken).toHaveBeenCalledWith({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    expect(mockRedisSet).not.toHaveBeenCalled();
  });

  it("Should return error when saving refresh token in Redis fails", async () => {
    const user = {
      id: "1",
      email: "test@example.com",
      password: "hashed_password",
      name: "Test User",
      role: "CLIENT",
      bio: "some bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockFindByEmail.mockResolvedValue(user);
    mockCompare.mockResolvedValue(true);

    (mockTokenProvider.generateAccessToken as jest.Mock).mockReturnValue(
      "access-token",
    );

    (mockTokenProvider.generateRefreshToken as jest.Mock).mockReturnValue(
      "refresh-token",
    );

    mockRedisSet.mockRejectedValue(new Error("Redis error"));

    await expect(service.execute("test@example.com", "123456")).rejects.toThrow(
      "Redis error",
    );

    expect(mockRedisSet).toHaveBeenCalledWith(
      `refresh:${user.id}`,
      "refresh-token",
      {
        EX: expect.any(Number),
      },
    );
  });

  it("Should login successfully and return user with tokens", async () => {
    const user = {
      id: "1",
      email: "test@example.com",
      password: "hashed_password",
      name: "Test User",
      role: "CLIENT",
      bio: "some bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockFindByEmail.mockResolvedValue(user);
    mockCompare.mockResolvedValue(true);

    (mockTokenProvider.generateAccessToken as jest.Mock).mockReturnValue(
      "access-token",
    );

    (mockTokenProvider.generateRefreshToken as jest.Mock).mockReturnValue(
      "refresh-token",
    );

    mockRedisSet.mockResolvedValue("OK");

    const result = await service.execute("test@example.com", "123456");

    expect(result).toEqual({
      user,
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    expect(mockFindByEmail).toHaveBeenCalledWith("test@example.com");

    expect(mockCompare).toHaveBeenCalledWith("123456", "hashed_password");

    expect(mockTokenProvider.generateAccessToken).toHaveBeenCalledWith({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    expect(mockTokenProvider.generateRefreshToken).toHaveBeenCalledWith({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    expect(mockRedisSet).toHaveBeenCalledWith(
      `refresh:${user.id}`,
      "refresh-token",
      {
        EX: expect.any(Number),
      },
    );
  });
});
