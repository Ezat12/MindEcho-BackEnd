import type { AddMoodDTO } from "../dto/add-mood.dto.js";
import type { MoodRepository } from "../repository/mood-repository.js";

export class CreateMoodService {
  constructor(private moodRepository: MoodRepository) {}

  async execute(mood: AddMoodDTO): Promise<void> {
    await this.moodRepository.addMood(mood);
  }
}
