import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockRedisDel = jest.fn<(key: string) => Promise<void>>();

jest.unstable_mockModule("config/redis.js", () => ({
  redisClient: {
    del: mockRedisDel,
  },
}));

const { LogoutService } =
  await import("../../../src/modules/auth/services/logout.service");

describe("LogoutService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const services = new LogoutService();

  it("Should call redisClient.del with the correct key", async () => {
    const userId = "12345";

    await services.execute(userId);

    expect(mockRedisDel).toHaveBeenCalledWith("refresh:12345");
  });

  it("Should return error when redis fail", async () => {
    mockRedisDel.mockRejectedValue(new Error("Redis error"));

    await expect(services.execute("12345")).rejects.toThrow("Redis error");
  });

  it("Should logout success", async () => {
    mockRedisDel.mockResolvedValue();
    await expect(services.execute("12345")).resolves.toBeUndefined();
  });
});
