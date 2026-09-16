import type { NextFunction, Request, Response } from "express";
import { describe, it, expect, jest } from "@jest/globals";
import type { Role } from "@prisma/client";
import { allowedTo } from "../../src/middlewares/allowedTo.js";

describe("allowedTo middleware", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const mockRequest = {
    user: {
      role: undefined,
    },
  } as unknown as Request;

  const mockResponse = {} as unknown as Response;

  const mockNextFunction = jest.fn<() => void>() as unknown as NextFunction;

  it("Should call next with an AppError if the user's role is not allowed", () => {
    const allowedRoles: Role[] = ["ADMIN"];

    mockRequest.user.role = "CLIENT";

    const allowedToMiddleware = allowedTo(allowedRoles);
    allowedToMiddleware(mockRequest, mockResponse, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "You are not allowed to perform this action",
        statusCode: 403,
      }),
    );
  });

  it("Should call next without an error if the user's role is allowed", () => {
    const allowedRoles: Role[] = ["ADMIN", "CLIENT"];

    mockRequest.user.role = "CLIENT";

    const allowedToMiddleware = allowedTo(allowedRoles);
    allowedToMiddleware(mockRequest, mockResponse, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledWith();
  });
});
