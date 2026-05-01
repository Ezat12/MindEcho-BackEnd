import type { Mood } from "../domain/mood.js";

export interface MoodRepository {
  getAllMoods(): Promise<Mood[]>;
  getMoodById(id: string): Promise<Mood | null>;
  addMood(mood: Mood): Promise<void>;
}
