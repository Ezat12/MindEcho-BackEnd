import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Journal } from "../../src/modules/journals/domain/journals";
import { GetAllJournalsService } from "../../src/modules/journals/services/get-journals.service";
import type { JournalsRepository } from "../../src/modules/journals/repository/journals.repository";

describe("GetAllJournalsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockGetAllJournals =
    jest.fn<() => Promise<{ journals: Journal[]; total: number }>>();

  const repository = {
    getAllJournals: mockGetAllJournals,
  } as unknown as JournalsRepository;

  const service = new GetAllJournalsService(repository);

  it("Should return journals and total pages when executed", async () => {
    const mockJournals: Journal[] = [
      {
        id: "1",
        title: "Test Journal",
        content: "This is a test journal entry.",
        userId: "user1",
        moodId: "mood1",
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockGetAllJournals.mockResolvedValue({
      journals: mockJournals,
      total: 1,
    });

    const queryParams = { limit: 10, page: 1 };

    const result = await service.execute(queryParams);

    expect(result.journals).toEqual(mockJournals);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it("should return error when repository throws an error", async () => {
    mockGetAllJournals.mockRejectedValue(new Error("Database error"));

    const queryParams = { limit: 10, page: 1 };

    await expect(service.execute(queryParams)).rejects.toThrow(
      "Database error",
    );
  });
});
