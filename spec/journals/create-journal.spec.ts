import { describe, it, jest } from "@jest/globals";

import type { Journal } from "../../src/modules/journals/domain/journals";
import type { Attachments } from "../../src/modules/journals/domain/attachments";
import type { MoodRepository } from "../../src/modules/mood/repository/mood-repository.js";
import type { UploadRepository } from "../../src/shared/uploads/upload.repository.js";
import type { JournalsRepository } from "../../src/modules/journals/repository/journals.repository";
import { CreateJournalService } from "../../src/modules/journals/services/create-journal.service.js";

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

  it("Check Mood id found", () => {
    mockGetMoodById.mockResolvedValue("1234");
  });
});
