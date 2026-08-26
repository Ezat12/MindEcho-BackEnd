import express from "express";
import {
  MakeCreateJournalController,
  MakeGetJournalByIdController,
  MakeGetAllJournalsController,
  MakeGetUserJournalsController,
  MakeUpdateJournalController,
  MakeDeleteAttachmentController,
  MakeDeleteJournalController,
} from "../design/factory-journal-route.js";
import { validate } from "middlewares/validate-zod.js";
import { CreateJournalSchema } from "../dto/create-journal.dto.js";
import { protectAuth } from "middlewares/protectAuth.js";
import { allowedTo } from "middlewares/allowedTo.js";
import { updateJournalSchema } from "../dto/update-journal.dto.js";
import { PrismaAuthRepository } from "modules/auth/repository/prisma-repository.js";
import upload from "middlewares/upload.js";
import { getJournalsQuerySchema } from "../dto/pagination.journals.dto.js";

const routerJournals = express.Router();

const createJournalController = MakeCreateJournalController();
const getAllJournalsController = MakeGetAllJournalsController();
const getJournalByIdController = MakeGetJournalByIdController();
const getUserJournalsController = MakeGetUserJournalsController();
const updateJournalController = MakeUpdateJournalController();
const deleteJournalController = MakeDeleteJournalController();
const makeDeleteAttachmentController = MakeDeleteAttachmentController();

const prismaAuthRepository = new PrismaAuthRepository();

routerJournals.post(
  "/",
  protectAuth(prismaAuthRepository),
  upload.array("attachments"),
  validate(CreateJournalSchema),
  createJournalController.handle,
);

routerJournals.get(
  "/",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  validate(getJournalsQuerySchema , "query"),
  getAllJournalsController.handle,
);

routerJournals.get(
  "/my-journals",
  protectAuth(prismaAuthRepository),
  validate(getJournalsQuerySchema),
  getUserJournalsController.handle,
);

routerJournals.get(
  "/:id",
  protectAuth(prismaAuthRepository),
  getJournalByIdController.handle,
);

routerJournals.put(
  "/:id",
  protectAuth(prismaAuthRepository),
  upload.array("attachments"),
  validate(updateJournalSchema),
  updateJournalController.handle,
);

routerJournals.delete(
  "/:id",
  protectAuth(prismaAuthRepository),
  deleteJournalController.handle,
);

routerJournals.delete(
  "/journal/:journalId/attachments/:attachmentId",
  protectAuth(prismaAuthRepository),
  makeDeleteAttachmentController.handle,
);

export { routerJournals as journalsRoutes };
