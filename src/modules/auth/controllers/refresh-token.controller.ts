import type { Request, Response } from "express";
import type { RefreshTokenService } from "../services/refresh-token.service.js";
import { AppError } from "shared/errors/app-error.js";

export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const refreshToken =
      res.locals.body?.refreshToken || req.cookies?.refreshToken;
    // console.log("cookies:", req.headers.cookie);

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    const newAccessToken = await this.refreshTokenService.execute(refreshToken);

    res.status(200).json({ status: "success", accessToken: newAccessToken });
  }
}
