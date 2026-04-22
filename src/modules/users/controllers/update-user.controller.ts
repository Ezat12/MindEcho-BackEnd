import type { Request, Response } from "express";
import type { UpdateUserService } from "../services/update.user.service.js";

export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const data = req.body;

    const user = await this.updateUserService.execute(String(id), data);

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  }
}
