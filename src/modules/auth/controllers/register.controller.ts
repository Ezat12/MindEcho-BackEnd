import type { Request, Response } from "express";
import type { RegisterService } from "../services/register.service.js";

export class RegisterController {
  constructor(private readonly registerService: RegisterService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const data = req.body;

    const { registeredUser, token } = await this.registerService.execute(data);

    res.status(201).json({ status: "success", data: registeredUser, token });
  }
}
