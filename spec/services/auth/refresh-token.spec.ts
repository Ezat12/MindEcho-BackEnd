import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import type { ITokenProvider } from "../../../src/modules/auth/provider/token-provider.js";

const mockVerify = jest.fn();

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: mockVerify,
  },
}));

const mockRedisGet = jest.fn<(key: string) => Promise<string | null>>();

jest.unstable_mockModule("config/redis.js", () => ({
  redisClient: {
    get: mockRedisGet,
  },
}));

const { RefreshTokenService } =
  await import("../../../src/modules/auth/services/refresh-token.service.js");

describe("RefreshTokenService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockTokenProvider = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
  } as unknown as ITokenProvider;

  const service = new RefreshTokenService(mockTokenProvider);

  it("Should return error when refresh token is invalid", async () => {
    mockVerify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await expect(service.execute("invalid-refresh-token")).rejects.toThrow(
      "Invalid refresh token",
    );

    expect(mockVerify).toHaveBeenCalledWith(
      "invalid-refresh-token",
      expect.any(String),
    );

    expect(mockRedisGet).not.toHaveBeenCalled();

    expect(mockTokenProvider.generateAccessToken).not.toHaveBeenCalled();
  });

  it("Should return error when refresh token does not exist in Redis", async () => {
    mockVerify.mockReturnValue({
      id: "1",
      email: "test@example.com",
      role: "CLIENT",
    });

    mockRedisGet.mockResolvedValue(null);

    await expect(service.execute("refresh-token")).rejects.toThrow(
      "Session expired",
    );

    expect(mockVerify).toHaveBeenCalled();

    expect(mockRedisGet).toHaveBeenCalledWith("refresh:1");

    expect(mockTokenProvider.generateAccessToken).not.toHaveBeenCalled();
  });

  it("Should return error when Redis refresh token is different", async () => {
    mockVerify.mockReturnValue({
      id: "1",
      email: "test@example.com",
      role: "CLIENT",
    });

    mockRedisGet.mockResolvedValue("another-refresh-token");

    await expect(service.execute("refresh-token")).rejects.toThrow(
      "Invalid refresh token",
    );

    expect(mockRedisGet).toHaveBeenCalledWith("refresh:1");

    expect(mockTokenProvider.generateAccessToken).not.toHaveBeenCalled();
  });

  it("Should return error when access token generation fails", async () => {
    mockVerify.mockReturnValue({
      id: "1",
      email: "test@example.com",
      role: "CLIENT",
    });

    mockRedisGet.mockResolvedValue("refresh-token");

    (mockTokenProvider.generateAccessToken as jest.Mock).mockImplementation(
      () => {
        throw new Error("Access token error");
      },
    );

    await expect(service.execute("refresh-token")).rejects.toThrow(
      "Access token error",
    );

    expect(mockTokenProvider.generateAccessToken).toHaveBeenCalledWith({
      id: "1",
      email: "test@example.com",
      role: "CLIENT",
    });
  });

  it("Should return new access token successfully", async () => {
    mockVerify.mockReturnValue({
      id: "1",
      email: "test@example.com",
      role: "CLIENT",
    });

    mockRedisGet.mockResolvedValue("refresh-token");

    (mockTokenProvider.generateAccessToken as jest.Mock).mockReturnValue(
      "new-access-token",
    );

    const result = await service.execute("refresh-token");

    expect(result).toBe("new-access-token");

    expect(mockVerify).toHaveBeenCalledWith(
      "refresh-token",
      expect.any(String),
    );

    expect(mockRedisGet).toHaveBeenCalledWith("refresh:1");

    expect(mockTokenProvider.generateAccessToken).toHaveBeenCalledWith({
      id: "1",
      email: "test@example.com",
      role: "CLIENT",
    });
  });
});
