import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Journal } from "../../src/modules/journals/domain/journals";
import type { JournalsRepository } from "../../src/modules/journals/repository/journals.repository";
import { GetJournalByIdService } from "../../src/modules/journals/services/get-journalById.service";

describe("GetJournalByIdService", () => {
  const mockGetJournalById = jest.fn<() => Promise<Journal | undefined>>();

  const repository = {
    getJournalById: mockGetJournalById,
  } as unknown as JournalsRepository;

  const service = new GetJournalByIdService(repository);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Should return journal when journal exists and belongs to user", async () => {
    const journal = {
      id: "journal-1234",
      title: "Hello",
      content: "I'm Good",
      userId: "user-1234",
      moodId: "mood-1234",
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Journal;

    mockGetJournalById.mockResolvedValue(journal);

    const result = await service.execute("journal-1234", "user-1234");

    expect(result).toEqual(journal);
  });

  it("Should Return Error when journal not found", async () => {
    mockGetJournalById.mockResolvedValue(undefined);

    const result = service.execute("journal-1234", "user-1234");

    await expect(result).rejects.toThrow("Journal not found");
  });

  it("Should Return Error when journal belongs to another user", async () => {
    const journal = {
      id: "journal-1234",
      title: "Hello",
      content: "I'm Good",
      userId: "another-user",
      moodId: "mood-1234",
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Journal;

    mockGetJournalById.mockResolvedValue(journal);

    const result = service.execute("journal-1234", "user-1234");

    await expect(result).rejects.toThrow("Journal not found");
  });

  it("Should Return Error when repository fails", async () => {
    mockGetJournalById.mockRejectedValue(new Error("Database error"));

    const result = service.execute("journal-1234", "user-1234");

    await expect(result).rejects.toThrow("Database error");
  });
});
