import type { Express } from "express";
import type { Multer } from "multer";
import { describe, expect, it, jest } from "@jest/globals";
import type { Journal } from "../../../src/modules/journals/domain/journals.js";
import type { Attachments } from "../../../src/modules/journals/domain/attachments.js";
import type { JournalsRepository } from "../../../src/modules/journals/repository/journals.repository.js";
import type { CreateJournalDTO } from "../../../src/modules/journals/dto/create-journal.dto.js";
import type { MoodRepository } from "../../../src/modules/mood/repository/mood-repository.js";
import type { UploadRepository } from "../../../src/shared/uploads/upload.repository.js";
import { CreateJournalService } from "../../../src/modules/journals/services/create-journal.service.js";

describe("CreateJournalServices", () => {
  const mockCreateJournal = jest.fn<() => Promise<Journal>>();

  const mockCreateAttachments = jest.fn<() => Promise<Attachments[]>>();

  const mockGetMoodById = jest.fn<() => Promise<string | undefined>>();

  const mockUploadAttachments =
    jest.fn<() => Promise<{ url: string; publicId: string }[]>>();

  const mockDeleteAttachment =
    jest.fn<() => Promise<{ url: string; publicId: string }>>();

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

  it("Should Return Error when create journals fails", async () => {
    mockGetMoodById.mockResolvedValue("1234");
    mockCreateJournal.mockRejectedValue(
      new Error("Error when created journal"),
    );

    const data = {
      title: "Hello",
      content: "I'm Good",
      moodId: "1234",
    } as CreateJournalDTO;

    const userId = "user-1234";

    const result = service.execute(data, [], userId);

    await expect(result).rejects.toThrow("Error when created journal");
  });

  it("Should Return Error when create attachments fails", async () => {
    const journal = {
      id: "journal-1234",
      title: "Hello",
      content: "I'm Good",
      userId: "user-1234",
      moodId: "1234",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Journal;

    mockGetMoodById.mockResolvedValue("1234");
    mockCreateJournal.mockResolvedValue(journal);
    mockCreateAttachments.mockRejectedValue(
      new Error("Error when created attachments"),
    );

    mockUploadAttachments.mockResolvedValue([
      {
        url: "https://example.com/image.jpg",
        publicId: "public-id-1234",
      },
    ]);

    const data = {
      title: "Hello",
      content: "I'm Good",
      moodId: "1234",
    } as CreateJournalDTO;

    const userId = "user-1234";

    const files = [
      {
        fieldname: "attachments",
        originalname: "image.jpg",
        buffer: Buffer.from("image data"),
        mimetype: "image/jpeg",
      },
    ] as Express.Multer.File[];

    const result = service.execute(data, files, userId);

    await expect(result).rejects.toThrow("Error when created attachments");
  });

  it("Should Return Error when upload attachments fails", async () => {
    mockGetMoodById.mockResolvedValue("1234");

    mockUploadAttachments.mockRejectedValue(
      new Error("Error when upload attachments"),
    );

    const data = {
      title: "Hello",
      content: "I'm Good",
      moodId: "1234",
    } as CreateJournalDTO;

    const userId = "user-1234";

    const files = [
      {
        fieldname: "attachments",
        originalname: "image.jpg",
        buffer: Buffer.from("image data"),
        mimetype: "image/jpeg",
      },
    ] as Express.Multer.File[];

    const result = service.execute(data, files, userId);

    await expect(result).rejects.toThrow("Error when upload attachments");
  });

  it("Should return journal and attachments when create journal and attachments success", async () => {
    const journal = {
      id: "journal-1234",
      title: "Hello",
      content: "I'm Good",
      userId: "user-1234",
      moodId: "1234",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Journal;

    const attachments = [
      {
        id: "attachment-1234",
        journalId: "journal-1234",
        url: "https://example.com/image.jpg",
        publicId: "public-id-1234",
        attachmentType: "IMAGE",
        createdAt: new Date(),
      },
    ] as Attachments[];

    mockGetMoodById.mockResolvedValue("1234");
    mockCreateJournal.mockResolvedValue(journal);
    mockCreateAttachments.mockResolvedValue(attachments);

    mockUploadAttachments.mockResolvedValue([
      {
        url: "https://example.com/image.jpg",
        publicId: "public-id-1234",
      },
    ]);

    const data = {
      title: "Hello",
      content: "I'm Good",
      moodId: "1234",
    } as CreateJournalDTO;

    const userId = "user-1234";

    const files = [
      {
        fieldname: "attachments",
        originalname: "image.jpg",
        buffer: Buffer.from("image data"),
        mimetype: "image/jpeg",
      },
    ] as Express.Multer.File[];

    const result = service.execute(data, files, userId);

    await expect(result).resolves.toEqual({
      journal,
      attachments,
    });
  });
});
