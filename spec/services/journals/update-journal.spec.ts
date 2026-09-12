import type { Express } from "express";
import type { Multer } from "multer";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Journal } from "../../../src/modules/journals/domain/journals";
import type { Attachments } from "../../../src/modules/journals/domain/attachments";
import type { JournalsRepository } from "../../../src/modules/journals/repository/journals.repository";
import type { UpdateJournalDTO } from "../../../src/modules/journals/dto/update-journal.dto";
import type { UploadRepository } from "../../../src/shared/uploads/upload.repository";
import { UpdateJournalService } from "../../../src/modules/journals/services/update-journal.service";
import type { AttachmentType } from ".prisma/client/index.js";

describe("UpdateJournalServices", () => {
  const mockGetJournalById = jest.fn<() => Promise<Journal | undefined>>();
  const mockUpdateJournal = jest.fn<() => Promise<Journal>>();
  const mockCreateAttachments = jest.fn<() => Promise<Attachments[]>>();
  const mockUploadAttachments =
    jest.fn<() => Promise<{ url: string; publicId: string }[]>>();
  const mockDeleteAttachment =
    jest.fn<
      (resourceType: AttachmentType, publicId: string) => Promise<void>
    >();

  const repository = {
    getJournalById: mockGetJournalById,
    updateJournal: mockUpdateJournal,
    createAttachments: mockCreateAttachments,
  } as unknown as JournalsRepository;

  const uploadRepository = {
    uploadAttachments: mockUploadAttachments,
    deleteAttachment: mockDeleteAttachment,
  } as unknown as UploadRepository;

  const service = new UpdateJournalService(repository, uploadRepository);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Should Return Error when journal not found", async () => {
    mockGetJournalById.mockResolvedValue(undefined);

    const result = service.execute(
      "user-1234",
      "journal-1234",
      [],
      {} as UpdateJournalDTO,
    );

    await expect(result).rejects.toThrow("Journal not found");
  });

  it("Should Return Error when journal belongs to another user", async () => {
    const journal = {
      id: "journal-1234",
      title: "Hello",
      content: "I'm Good",
      userId: "another-user",
      moodId: "1234",
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Journal;

    mockGetJournalById.mockResolvedValue(journal);

    const result = service.execute(
      "user-1234",
      "journal-1234",
      [],
      {} as UpdateJournalDTO,
    );

    await expect(result).rejects.toThrow("Journal not found");
  });

  it("Should Return Error when upload attachments fails", async () => {
    const journal = {
      id: "journal-1234",
      title: "Hello",
      content: "I'm Good",
      userId: "user-1234",
      moodId: "1234",
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Journal;

    mockGetJournalById.mockResolvedValue(journal);

    mockUploadAttachments.mockRejectedValue(
      new Error("Error when upload attachments"),
    );

    const files = [
      {
        fieldname: "attachments",
        originalname: "image.jpg",
        buffer: Buffer.from("image data"),
        mimetype: "image/jpeg",
      },
    ] as Express.Multer.File[];

    const uploadJournal = {
      title: "Hello",
    } as UpdateJournalDTO;

    const result = service.execute(
      "user-1234",
      "journal-1234",
      files,
      uploadJournal,
    );

    await expect(result).rejects.toThrow("Error when upload attachments");
  });

  it("Should Return Error when update journal fails", async () => {
    const journal = {
      id: "journal-1234",
      title: "Hello",
      content: "I'm Good",
      userId: "user-1234",
      moodId: "1234",
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Journal;

    mockGetJournalById.mockResolvedValue(journal);

    mockUpdateJournal.mockRejectedValue(new Error("Error when update journal"));

    const uploadJournal = {
      title: "Hello",
    } as UpdateJournalDTO;

    const result = service.execute(
      "user-1234",
      "journal-1234",
      [],
      uploadJournal,
    );

    await expect(result).rejects.toThrow("Error when update journal");
  });

  it("Should Return Error when create attachments fails", async () => {
    const journal = {
      id: "journal-1234",
      title: "Hello",
      content: "I'm Good",
      userId: "user-1234",
      moodId: "1234",
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Journal;

    mockGetJournalById.mockResolvedValue(journal);

    mockUpdateJournal.mockResolvedValue(journal);

    mockUploadAttachments.mockResolvedValue([
      {
        url: "https://example.com/image.jpg",
        publicId: "public-id-1234",
      },
    ]);

    mockCreateAttachments.mockRejectedValue(
      new Error("Error when create attachments"),
    );

    const files = [
      {
        fieldname: "attachments",
        originalname: "image.jpg",
        buffer: Buffer.from("image data"),
        mimetype: "image/jpeg",
      },
    ] as Express.Multer.File[];

    const uploadJournal = {
      title: "Hello",
    } as UpdateJournalDTO;

    const result = service.execute(
      "user-1234",
      "journal-1234",
      files,
      uploadJournal,
    );

    await expect(result).rejects.toThrow("Error when create attachments");

    expect(mockDeleteAttachment).toHaveBeenCalledWith(
      "IMAGE",
      "public-id-1234",
    );
  });

  it("Should Return Updated Journal when update succeeds without attachments", async () => {
    const journal = {
      id: "journal-1234",
      userId: "user-1234",
    } as Journal;

    mockGetJournalById.mockResolvedValue(journal);
    mockUpdateJournal.mockResolvedValue(journal);

    const result = service.execute(
      "user-1234",
      "journal-1234",
      [],
      {} as UpdateJournalDTO,
    );

    await expect(result).resolves.toEqual({
      journal,
      attachments: [],
    });
  });

  it("Should Return Updated Journal and Attachments when update succeeds", async () => {
    const journal = {
      id: "journal-1234",
      userId: "user-1234",
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

    mockGetJournalById.mockResolvedValue(journal);
    mockUpdateJournal.mockResolvedValue(journal);

    mockUploadAttachments.mockResolvedValue([
      {
        url: "https://example.com/image.jpg",
        publicId: "public-id-1234",
      },
    ]);

    mockCreateAttachments.mockResolvedValue(attachments);

    const files = [
      {
        fieldname: "attachments",
        originalname: "image.jpg",
        buffer: Buffer.from("image data"),
        mimetype: "image/jpeg",
      },
    ] as Express.Multer.File[];

    const uploadJournal = {
      title: "Hello",
    } as UpdateJournalDTO;

    const result = service.execute(
      "user-1234",
      "journal-1234",
      files,
      uploadJournal,
    );

    await expect(result).resolves.toEqual({
      journal,
      attachments,
    });
  });
});
