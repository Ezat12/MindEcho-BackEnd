import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import type { Journal } from "../../../src/modules/journals/domain/journals.js";
import type { JournalsRepository } from "../../../src/modules/journals/repository/journals.repository.js";
import { DeleteJournalService } from "../../../src/modules/journals/services/delete-journal.service.js";
import type { Role } from "@prisma/client";

describe("DeleteJournalService", () => {
  const mockGetJournalById = jest.fn<() => Promise<Journal | undefined>>();

  const mockDeleteJournal = jest.fn<(id: string) => Promise<void>>();

  const repository = {
    getJournalById: mockGetJournalById,
    deleteJournal: mockDeleteJournal,
  } as unknown as JournalsRepository;

  const service = new DeleteJournalService(repository);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should throw an error when journal does not exist", async () => {
    mockGetJournalById.mockResolvedValue(undefined);

    await expect(
      service.execute("journal-123", "user-123", "CLIENT" as Role),
    ).rejects.toThrow("Journal not found");

    expect(mockDeleteJournal).not.toHaveBeenCalled();
  });

  it("should allow ADMIN to delete any journal", async () => {
    const journal: Journal = {
      id: "journal-123",
      title: "Test Journal",
      content: "Test content",
      userId: "another-user",
      moodId: "mood-123",
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetJournalById.mockResolvedValue(journal);
    mockDeleteJournal.mockResolvedValue();

    const result = await service.execute(
      "journal-123",
      "user-123",
      "ADMIN" as Role,
    );

    expect(result).toBe(true);

    expect(mockDeleteJournal).toHaveBeenCalledWith("journal-123");
  });

  it("should throw an error when user tries to delete another user's journal", async () => {
    const journal: Journal = {
      id: "journal-123",
      title: "Test Journal",
      content: "Test content",
      userId: "another-user",
      moodId: "mood-123",
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetJournalById.mockResolvedValue(journal);

    await expect(
      service.execute("journal-123", "user-123", "CLIENT" as Role),
    ).rejects.toThrow("Journal not found");

    expect(mockDeleteJournal).not.toHaveBeenCalled();
  });

  it("should allow user to delete their own journal", async () => {
    const journal: Journal = {
      id: "journal-123",
      title: "Test Journal",
      content: "Test content",
      userId: "user-123",
      moodId: "mood-123",
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetJournalById.mockResolvedValue(journal);
    mockDeleteJournal.mockResolvedValue();

    const result = await service.execute(
      "journal-123",
      "user-123",
      "CLIENT" as Role,
    );

    expect(result).toBe(true);

    expect(mockDeleteJournal).toHaveBeenCalledWith("journal-123");
  });

  it("should throw an error when deleteJournal fails", async () => {
    const journal: Journal = {
      id: "journal-123",
      title: "Test Journal",
      content: "Test content",
      userId: "user-123",
      moodId: "mood-123",
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetJournalById.mockResolvedValue(journal);

    mockDeleteJournal.mockRejectedValue(new Error("Database error"));

    await expect(
      service.execute("journal-123", "user-123", "CLIENT" as Role),
    ).rejects.toThrow("Database error");

    expect(mockDeleteJournal).toHaveBeenCalledWith("journal-123");
  });
});
