import type { GetAllMoodsService } from "../services/get-all.service.js";
import type { Request, Response } from "express";

export class GetAllMoodsController {
  constructor(private getAllMoodsService: GetAllMoodsService) {}

  async handle(req: Request, res: Response) {
    const moods = await this.getAllMoodsService.execute();

    res.status(200).json({
      status: "success",
      data: moods,
    });
  }
}
