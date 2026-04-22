import type { Request, Response } from "express";
import type { GetByIdUserService } from "../services/getId-user.service.js";

export class GetByIdUserController {
  constructor(private readonly getByIdUserService: GetByIdUserService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const user = await this.getByIdUserService.execute(String(id));

    return res.status(200).json({
      status: "success",
      data: user,
    });
  }
}
