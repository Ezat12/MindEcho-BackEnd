import type { LoginService } from "../services/login.service.js";
import type { Request, Response } from "express";

export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const { user, token } = await this.loginService.execute(email, password);

    res.status(200).json({ status: "success", data: user, token });
  }
}
