import type { GetMoodByIdService } from "../services/getById-mood.service.js";
import type { Request, Response } from "express";

export class GetByIdMoodController {
  constructor(private getMoodByIdService: GetMoodByIdService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const mood = await this.getMoodByIdService.execute(String(id));

    res.status(200).json({
      status: "success",
      data: mood,
    });
  }
}
