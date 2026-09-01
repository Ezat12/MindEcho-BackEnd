import { describe, it, jest } from "@jest/globals";
import type { Journal } from "../../src/modules/journals/domain/journals";
import type { Attachments } from "../../src/modules/journals/domain/attachments";
import type { JournalsRepository } from "../../src/modules/journals/repository/journals.repository";
import type { CreateJournalDTO } from "../../src/modules/journals/dto/create-journal.dto";
import type { MoodRepository } from "../../src/modules/mood/repository/mood-repository";
import type { UploadRepository } from "../../src/shared/uploads/upload.repository";
import { CreateJournalService } from "../../src/modules/journals/services/create-journal.service";

describe("CreateJournalServices", () => {
  const mockCreateJournal = jest.fn<() => Promise<Journal>>();

  const mockCreateAttachments = jest.fn<() => Promise<Attachments[]>>();

  const mockGetMoodById = jest.fn<() => Promise<string | undefined>>();

  const mockUploadAttachments = jest.fn();

  const mockDeleteAttachment = jest.fn();

  const repository = {
    createJournal: mockCreateJournal,
    createAttachments: mockCreateAttachments,
  } as unknown as JournalsRepository;

  const moodRepository = {
    getMoodById: mockGetMoodById,
  } as unknown as MoodRepository;

  const uploadRepository = {
    uploadAttachments: mockUploadAttachments,
    deleteAttachment: mockDeleteAttachment,
  } as unknown as UploadRepository;

  const service = new CreateJournalService(
    repository,
    uploadRepository,
    moodRepository,
  );

  it("Should Return Error when moodId not found", async () => {
    mockGetMoodById.mockResolvedValue(undefined);

    const data = {
      title: "Hello",
      content: "I'm Good",
      moodId: "1234",
    } as CreateJournalDTO;

    const userId = "user-1234";

    const result = service.execute(data, [], userId);

    await expect(result).rejects.toThrow("Mood not found");
  });
});
