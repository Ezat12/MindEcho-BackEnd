import { prisma } from "config/prisma.js";
import type { Mood } from "../domain/mood.js";
import type { MoodRepository } from "./mood-repository.js";

export class PrismaMoodRepository implements MoodRepository {
  async getAllMoods(): Promise<Mood[]> {
    return prisma.moods.findMany();
  }

  async getMoodById(id: string): Promise<Mood | null> {
    return prisma.moods.findUnique({
      where: {
        id,
      },
    });
  }

  async addMood(mood: Mood): Promise<void> {
    const data = {
      id: mood.id,
      name: mood.name,
      slug: mood.slug,
      icon: mood.icon || null,
      description: mood.description || null,
    };

    await prisma.moods.create({
      data,
    });
  }
}
