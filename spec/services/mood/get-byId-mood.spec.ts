import { describe, expect, it, jest } from "@jest/globals";

import type { Mood } from "../../../src/modules/mood/domain/mood";
import type { MoodRepository } from "../../../src/modules/mood/repository/mood-repository";

const mockGetMoodById = jest.fn<(id: string) => Promise<Mood | null>>();

const mockMoodRepository = {
  getMoodById: mockGetMoodById,
} as unknown as MoodRepository;

const { GetMoodByIdService } =
  await import("../../../src/modules/mood/services/getById-mood.service");

describe("GetMoodByIdService", () => {
  const service = new GetMoodByIdService(mockMoodRepository);

  it("Should return mood successfully", async () => {
    const mood = {
      id: "1",
      name: "Happy",
      slug: "happy",
      icon: "😊",
      description: "Feeling happy",
    } as Mood;

    mockGetMoodById.mockResolvedValue(mood);

    const result = await service.execute("1");

    expect(result).toEqual(mood);
    expect(mockGetMoodById).toHaveBeenCalledWith("1");
  });

  it("Should return error when mood does not exist", async () => {
    mockGetMoodById.mockResolvedValue(null);

    await expect(service.execute("1")).rejects.toThrow("Mood not found");

    expect(mockGetMoodById).toHaveBeenCalledWith("1");
  });

  it("Should return error when repository fails", async () => {
    mockGetMoodById.mockRejectedValue(new Error("Database error"));

    await expect(service.execute("1")).rejects.toThrow("Database error");
  });
});
