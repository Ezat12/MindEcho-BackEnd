import { describe, expect, it, jest } from "@jest/globals";
import { GetUserJournalsService } from "../../src/modules/journals/services/get-userJournals.service";
import type { JournalsRepository } from "../../src/modules/journals/repository/journals.repository";
import type { Journal } from "../../src/modules/journals/domain/journals";

describe("GetUserJournalsServices", () => {
  const mockGetUserJournals =
    jest.fn<() => Promise<{ journals: Journal[]; total: number }>>();

  const repository = {
    getUserJournals: mockGetUserJournals,
  } as unknown as JournalsRepository;

  const service = new GetUserJournalsService(repository);

  const total = 25;

  it("Should return a correct total page", async () => {
    mockGetUserJournals.mockResolvedValue({
      journals: [],
      total,
    });

    const queryParams = {
      limit: 10,
      page: 1,
      sort: "createdAt",
      order: "desc",
    };

    const userId = "1234";

    expect((await service.execute(userId, queryParams)).totalPages).toBe(
      Math.ceil(total / queryParams.limit),
    );
  });

  it("Should throw error when repository fails", async () => {
    mockGetUserJournals.mockRejectedValueOnce(new Error("Data base error"));

    const queryParams = {
      limit: 10,
      page: 1,
      sort: "createdAt",
      order: "desc",
    };

    const userId = "1234";

    await expect(service.execute(userId, queryParams)).rejects.toThrow(
      "Data base error",
    );
  });
});
