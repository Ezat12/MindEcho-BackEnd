import type { Request, Response } from "express";
import type { LogoutService } from "../services/logout.service.js";

export class LogoutController {
  constructor(private readonly logoutService: LogoutService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const userId = req.user.id;

    await this.logoutService.execute(userId);

    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  }
}
