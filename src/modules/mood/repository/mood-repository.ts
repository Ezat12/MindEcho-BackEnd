import type { Mood } from "../domain/mood.js";
import type { AddMoodDTO } from "../dto/add-mood.dto.js";

export interface MoodRepository {
  getAllMoods(): Promise<Mood[]>;
  getMoodById(id: string): Promise<Mood | null>;
  addMood(mood: AddMoodDTO): Promise<void>;
  findMany(moodIds: string[]): Promise<Mood[]>;
}
