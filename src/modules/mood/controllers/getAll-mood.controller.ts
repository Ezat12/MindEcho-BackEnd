import type { GetAllMoodsService } from "../services/getAll-mood.service.js";
import type { Request, Response } from "express";

export class GetAllMoodsController {
  constructor(private getAllMoodsService: GetAllMoodsService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const moods = await this.getAllMoodsService.execute();

    res.status(200).json({
      status: "success",
      data: moods,
    });
  }
}
