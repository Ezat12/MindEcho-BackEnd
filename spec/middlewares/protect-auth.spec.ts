import type { NextFunction, Request, Response } from "express";
import { describe, jest, expect, it } from "@jest/globals";
import type { IAuthRepository } from "../../src/modules/auth/repository/auth-repository.js";
import type { User } from "../../src/modules/users/domain/user.js";

const mockVerify = jest.fn<() => any>();
jest.unstable_mockModule("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    verify: mockVerify,
  },
}));

const { protectAuth } = await import("../../src/middlewares/protectAuth.js");

describe("ProtectAuthMiddleware", () => {
  const mockFindById = jest.fn<() => Promise<User | null>>();

  const mockRequest = {
    headers: {
      authorization: undefined,
    },
  } as unknown as Request;

  const mockResponse = {} as unknown as Response;
  const mockNextFunction = jest.fn<() => void>() as unknown as NextFunction;

  const mockAuthRepository = {
    findById: mockFindById,
  } as unknown as IAuthRepository;

  const protectAuthMiddleware = protectAuth(mockAuthRepository);

  it("Should throw an error if no authorization header is provided", async () => {
    mockRequest.headers.authorization = undefined;

    protectAuthMiddleware(mockRequest, mockResponse, mockNextFunction);

    await new Promise(setImmediate);

    expect(mockNextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "You are not authenticated",
        statusCode: 401,
      }),
    );
  });
});
