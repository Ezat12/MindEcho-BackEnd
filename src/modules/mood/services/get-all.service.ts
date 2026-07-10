import type { Mood } from "../domain/mood.js";
import type { MoodRepository } from "../repository/mood-repository.js";

export class GetAllMoodsService {
  constructor(private moodRepository: MoodRepository) {}

  async execute(): Promise<Mood[]> {
    return this.moodRepository.getAllMoods();
  }
}
