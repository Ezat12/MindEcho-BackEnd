import type { MoodRepository } from "../repository/mood-repository.js";
import type { Request, Response } from "express";

export class CreateMoodController {
  constructor(private moodRepository: MoodRepository) {}

  async handle(req: Request, res: Response) {
    await this.moodRepository.addMood(req.body);

    res.status(201).json({
      status: "success",
      message: "Mood created successfully",
    });
  }
}
