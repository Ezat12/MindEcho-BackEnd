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
    user: undefined,
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

  it("Should throw an error if token is malformed", async () => {
    mockRequest.headers.authorization = "Bearer";

    protectAuthMiddleware(mockRequest, mockResponse, mockNextFunction);

    await new Promise(setImmediate);

    expect(mockNextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "You are not authenticated",
        statusCode: 401,
      }),
    );
  });

  it("should return error when decoded token failed", async () => {
    mockRequest.headers.authorization = "Bearer hiiiiiiiiiiiii";

    mockVerify.mockImplementation(() => {
      throw new Error("error when decoded token");
    });

    protectAuthMiddleware(mockRequest, mockResponse, mockNextFunction);
    await new Promise(setImmediate);

    expect(mockNextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Invalid token: error when decoded token",
        statusCode: 401,
      }),
    );
  });

  it("should throw an error when decoded token failed", async () => {
    mockRequest.headers.authorization = "Bearer hiiiiiiiiiiiii";

    mockVerify.mockImplementation(() => {
      return {
        id: "123",
      };
    });

    mockFindById.mockResolvedValue(null);

    protectAuthMiddleware(mockRequest, mockResponse, mockNextFunction);
    await new Promise(setImmediate);

    expect(mockNextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User not found",
        statusCode: 404,
      }),
    );
  });

  it("Should pass when user authenticated", async () => {
    mockRequest.headers.authorization = "Bearer hiiiiiiiiiiiii";
    mockVerify.mockImplementation(() => {
      return {
        id: "123",
      };
    });

    const user = {
      id: "123",
      email: "user@example.com",
      password: "hashed_password",
      name: "John Doe",
      role: "CLIENT",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockFindById.mockResolvedValue(user);

    protectAuthMiddleware(mockRequest, mockResponse, mockNextFunction);
    await new Promise(setImmediate);

    expect(mockNextFunction).toHaveBeenCalledWith();
    expect(mockRequest.user).toEqual(user);
  });
});
