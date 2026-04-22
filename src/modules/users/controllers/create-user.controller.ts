import type { Request, Response } from "express";

import type { CreateUserService } from "../services/create-user.service.js";

export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    // const data = createUserSchema.parse(req.body);

    const data = req.body;

    const user = await this.createUserService.execute(data);

    return res.status(201).json({ status: "success", data: user });
  }
}
