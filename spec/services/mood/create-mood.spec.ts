import { describe, expect, it, jest } from "@jest/globals";

import type { AddMoodDTO } from "../../../src/modules/mood/dto/add-mood.dto.js";
import type { MoodRepository } from "../../../src/modules/mood/repository/mood-repository.js";

const mockAddMood = jest.fn<(mood: AddMoodDTO) => Promise<void>>();

const mockMoodRepository = {
  addMood: mockAddMood,
} as unknown as MoodRepository;

const { CreateMoodService } =
  await import("../../../src/modules/mood/services/create-mood.service.js");

describe("CreateMoodService", () => {
  const service = new CreateMoodService(mockMoodRepository);

  it("Should add mood successfully", async () => {
    const mood: AddMoodDTO = {
      name: "Happy",
      slug: "happy",
      icon: "😊",
      description: "Feeling happy",
    };

    mockAddMood.mockResolvedValue();

    await service.execute(mood);

    expect(mockAddMood).toHaveBeenCalledWith(mood);
  });

  it("Should return error when repository fails", async () => {
    const mood: AddMoodDTO = {
      name: "Happy",
      slug: "happy",
      icon: "😊",
      description: "Feeling happy",
    };

    mockAddMood.mockRejectedValue(new Error("Database error"));

    await expect(service.execute(mood)).rejects.toThrow("Database error");
  });
});
