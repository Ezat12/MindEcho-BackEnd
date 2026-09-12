import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Journal } from "../../../src/modules/journals/domain/journals";
import type { JournalsRepository } from "../../../src/modules/journals/repository/journals.repository";
import type { UploadRepository } from "../../../src/shared/uploads/upload.repository";
import { DeleteAttachmentService } from "../../../src/modules/journals/services/delete-attachment.service";
import type { Attachments } from "../../../src/modules/journals/domain/attachments";

describe("DeleteAttachmentService", () => {
  const mockGetJournalById = jest.fn<() => Promise<Journal | undefined>>();

  const mockDeleteAttachment = jest.fn<(id: string) => Promise<void>>();

  const mockUploadDeleteAttachment =
    jest.fn<(attachmentType: string, publicId: string) => Promise<void>>();

  const repository = {
    getJournalById: mockGetJournalById,
    deleteAttachment: mockDeleteAttachment,
  } as unknown as JournalsRepository;

  const uploadRepository = {
    deleteAttachment: mockUploadDeleteAttachment,
  } as unknown as UploadRepository;

  const service = new DeleteAttachmentService(repository, uploadRepository);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should throw an error when journal does not exist", async () => {
    mockGetJournalById.mockResolvedValue(undefined);

    await expect(
      service.execute("user-123", "journal-123", "attachment-123"),
    ).rejects.toThrow("Journal not found");

    expect(mockUploadDeleteAttachment).not.toHaveBeenCalled();
    expect(mockDeleteAttachment).not.toHaveBeenCalled();
  });

  it("should throw an error when user is not authorized", async () => {
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
      service.execute("user-123", "journal-123", "attachment-123"),
    ).rejects.toThrow("You are not authorized to delete this attachment");

    expect(mockUploadDeleteAttachment).not.toHaveBeenCalled();
    expect(mockDeleteAttachment).not.toHaveBeenCalled();
  });

  it("should throw an error when attachment does not exist", async () => {
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

    await expect(
      service.execute("user-123", "journal-123", "attachment-123"),
    ).rejects.toThrow("Attachment not found");

    expect(mockUploadDeleteAttachment).not.toHaveBeenCalled();
    expect(mockDeleteAttachment).not.toHaveBeenCalled();
  });

  it("should delete attachment from upload storage and database", async () => {
    const journal: Journal = {
      id: "journal-123",
      title: "Test Journal",
      content: "Test content",
      userId: "user-123",
      moodId: "mood-123",
      attachments: [
        {
          id: "attachment-123",
          url: "https://example.com/image.jpg",
          publicId: "public-id-123",
          attachmentType: "IMAGE",
        } as unknown as Attachments,
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetJournalById.mockResolvedValue(journal);
    mockUploadDeleteAttachment.mockResolvedValue();
    mockDeleteAttachment.mockResolvedValue();

    await service.execute("user-123", "journal-123", "attachment-123");

    expect(mockUploadDeleteAttachment).toHaveBeenCalledWith(
      "IMAGE",
      "public-id-123",
    );

    expect(mockDeleteAttachment).toHaveBeenCalledWith("attachment-123");
  });

  it("should throw an error when upload deletion fails", async () => {
    const journal: Journal = {
      id: "journal-123",
      title: "Test Journal",
      content: "Test content",
      userId: "user-123",
      moodId: "mood-123",
      attachments: [
        {
          id: "attachment-123",
          url: "https://example.com/image.jpg",
          publicId: "public-id-123",
          attachmentType: "IMAGE",
        } as unknown as Attachments,
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetJournalById.mockResolvedValue(journal);

    mockUploadDeleteAttachment.mockRejectedValue(
      new Error("Upload deletion failed"),
    );

    await expect(
      service.execute("user-123", "journal-123", "attachment-123"),
    ).rejects.toThrow("Upload deletion failed");

    expect(mockDeleteAttachment).not.toHaveBeenCalled();
  });
});
