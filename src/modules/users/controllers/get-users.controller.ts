import type { Request, Response } from "express";
import type { GetAllUsersService } from "../services/get-users.service.js";

export class GetUsersController {
  constructor(private readonly getUsersService: GetAllUsersService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const users = await this.getUsersService.execute();

    return res.status(200).json({
      status: "success",
      data: users,
    });
  }
}
