import { AppError } from "shared/errors/app-error.js";
import type { Mood } from "../domain/mood.js";
import type { MoodRepository } from "../repository/mood-repository.js";

export class GetMoodByIdService {
  constructor(private moodRepository: MoodRepository) {}

  async execute(id: string): Promise<Mood | null> {
    const mood = await this.moodRepository.getMoodById(id);

    if (!mood) {
      throw new AppError("Mood not found", 404);
    }

    return mood;
  }
}
