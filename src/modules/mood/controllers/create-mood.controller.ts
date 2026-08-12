import type { MoodRepository } from "../repository/mood-repository.js";
import type { Request, Response } from "express";
import type { CreateMoodService } from "../services/create-mood.service.js";

export class CreateMoodController {
  constructor(private moodRepository: CreateMoodService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    await this.moodRepository.execute(req.body);

    res.status(201).json({
      status: "success",
      message: "Mood created successfully",
    });
  }
}
