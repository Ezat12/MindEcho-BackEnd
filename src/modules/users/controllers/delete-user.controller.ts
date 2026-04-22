import type { Request, Response } from "express";
import type { DeleteUserService } from "../services/delete-user.service.js";

export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    await this.deleteUserService.execute(String(id));

    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  }
}
