import type { LoginService } from "../services/login.service.js";
import type { Request, Response } from "express";

export class LoginController {
  constructor(private readonly loginService: LoginService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await this.loginService.execute(
      email,
      password,
    );

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({ status: "success", data: user, accessToken });
  }
}
