import { prisma } from "config/prisma.js";
import type { CreateJournalDTO } from "../dto/create-journal.dto.js";
import type { JournalsRepository } from "./journals.repository.js";
import type { Journal } from "../domain/journals.js";
import type { UpdateJournalDTO } from "../dto/update-journal.dto.js";

export class PrismaJournalRepository implements JournalsRepository {
  async createJournal(
    data: CreateJournalDTO,
    userId: string,
  ): Promise<Journal> {
    const journal = await prisma.journals.create({
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
    });

    return journal;
  }

  // Admin
  async getAllJournals(): Promise<Journal[]> {
    const journals = await prisma.journals.findMany();

    return journals;
  }

  // User
  async getUserJournals(userId: string): Promise<Journal[]> {
    const journals = await prisma.journals.findMany({
      where: {
        userId: userId,
      },
    });

    return journals;
  }

  async updateJournal(id: string, data: UpdateJournalDTO): Promise<Journal> {
    const journal = await prisma.journals.update({
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
}
