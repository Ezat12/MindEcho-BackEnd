import { describe, expect, it, jest } from "@jest/globals";

import type { Mood } from "../../src/modules/mood/domain/mood";
import type { MoodRepository } from "../../src/modules/mood/repository/mood-repository";

const mockGetAllMoods = jest.fn<() => Promise<Mood[]>>();

const mockMoodRepository = {
  getAllMoods: mockGetAllMoods,
} as unknown as MoodRepository;

const { GetAllMoodsService } =
  await import("../../src/modules/mood/services/getAll-mood.service");

describe("GetAllMoodsService", () => {
  const service = new GetAllMoodsService(mockMoodRepository);

  it("Should return all moods successfully", async () => {
    const moods = [
      {
        id: "1",
        name: "Happy",
        slug: "happy",
        icon: "😊",
        description: "Feeling happy",
      },
      {
        id: "2",
        name: "Sad",
        slug: "sad",
        icon: "😔",
        description: "Feeling sad",
      },
    ] as Mood[];

    mockGetAllMoods.mockResolvedValue(moods);

    const result = await service.execute();

    expect(result).toEqual(moods);
    expect(mockGetAllMoods).toHaveBeenCalled();
  });

  it("Should return error when repository fails", async () => {
    mockGetAllMoods.mockRejectedValue(new Error("Database error"));

    await expect(service.execute()).rejects.toThrow("Database error");
  });
});
