import { prisma } from "config/prisma.js";
import type { CreateJournalDTO } from "../dto/create-journal.dto.js";
import type { JournalsRepository } from "./journals.repository.js";
import type { Journal } from "../domain/journals.js";
import type { UpdateJournalDTO } from "../dto/update-journal.dto.js";
import type { AttachmentType, Prisma } from ".prisma/client/index.js";
import type { CreateAttachment } from "../dto/create-attachments-journal.js";
import type { Attachments } from "../domain/attachments.js";
import type { GetJournalsQueryDTO } from "../dto/pagination.journals.dto.js";

export class PrismaJournalRepository implements JournalsRepository {
  async createJournal(
    tx: Prisma.TransactionClient,
    data: CreateJournalDTO,
    userId: string,
  ): Promise<Journal> {
    const journal = await tx.journals.create({
      data: {
        title: data.title,
        content: data.content,
        userId: userId,
        moodId: data.moodId ?? null,
      },
    });

    return journal;
  }

  async getJournalById(id: string): Promise<Journal | null> {
    const journal = await prisma.journals.findUnique({
      where: {
        id,
      },
      include: {
        attachments: true,
      },
    });

    return journal;
  }

  // Admin
  async getAllJournals(queryParams: GetJournalsQueryDTO): Promise<{
    journals: Journal[];
    total: number;
  }> {
    console.log("Query Params", queryParams);
    const skip = (queryParams.page - 1) * queryParams.limit;

    const where = {
      ...(queryParams.moodId && {
        moodId: queryParams.moodId,
      }),

      ...(queryParams.search && {
        OR: [
          {
            title: {
              contains: queryParams.search,
              mode: "insensitive" as const,
            },
          },
          {
            content: {
              contains: queryParams.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
    };

    const [journals, total] = await prisma.$transaction([
      prisma.journals.findMany({
        skip,
        take: queryParams.limit,

        where,

        include: {
          attachments: true,
        },

        orderBy: {
          [queryParams.sort]: queryParams.order,
        },
      }),

      prisma.journals.count({
        where,
      }),
    ]);

    return {
      journals,
      total,
    };
  }

  // User
  async getUserJournals(
    userId: string,
    queryParams: GetJournalsQueryDTO,
  ): Promise<{ journals: Journal[]; total: number }> {
    const skip = (queryParams.page - 1) * queryParams.limit;

    const take = queryParams.limit;

    const where = {
      userId,
      ...(queryParams.moodId && {
        moodId: queryParams.moodId,
      }),
      ...(queryParams.search && {
        OR: [
          {
            title: {
              contains: queryParams.search,
              mode: "insensitive" as const,
            },
          },
          {
            content: {
              contains: queryParams.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
    };

    const [journals, total] = await prisma.$transaction([
      prisma.journals.findMany({
        skip,
        take,
        where,
        include: {
          attachments: true,
        },

        orderBy: {
          [queryParams.sort]: queryParams.order,
        },
      }),

      prisma.journals.count({ where }),
    ]);

    return { journals, total };
  }

  async updateJournal(
    tx: Prisma.TransactionClient,
    id: string,
    data: UpdateJournalDTO,
  ): Promise<Journal> {
    const journal = await tx.journals.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.moodId !== undefined && { moodId: data.moodId }),
      },
    });

    return journal;
  }

  async deleteJournal(id: string): Promise<void> {
    await prisma.journals.delete({ where: { id } });
  }

  async createAttachments(
    tx: Prisma.TransactionClient,
    journalId: string,
    attachments: CreateAttachment[],
  ): Promise<Attachments[]> {
    const createdAttachments = await tx.journalAttachment.createManyAndReturn({
      data: attachments.map((attachment) => ({
        journalId: journalId,
        url: attachment.url,
        publicId: attachment.publicId,
        attachmentType: attachment.attachmentType,
      })),
    });

    return createdAttachments;
  }

  async deleteAttachment(attachmentId: string): Promise<void> {
    await prisma.journalAttachment.delete({
      where: { id: attachmentId },
    });
  }

  async getAttachmentsByJournalId(journalId: string): Promise<Attachments[]> {
    const attachments = await prisma.journalAttachment.findMany({
      where: {
        journalId: journalId,
      },
    });

    return attachments;
  }
}
