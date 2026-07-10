import express from "express";
import {
  MakeCreateJournalController,
  MakeGetJournalByIdController,
  MakeGetAllJournalsController,
  MakeGetUserJournalsController,
  MakeUpdateJournalController,
  MakeDeleteJournalController,
} from "../design/factory-journal-route.js";
import { validate } from "middlewares/validate-zod.js";
import { CreateJournalSchema } from "../dto/create-journal.dto.js";
import { protectAuth } from "middlewares/protectAuth.js";
import { allowedTo } from "middlewares/allowedTo.js";
import { updateJournalSchema } from "../dto/update-journal.dto.js";
import { PrismaAuthRepository } from "modules/auth/repository/prisma-repository.js";

const routerJournals = express.Router();

const createJournalController = MakeCreateJournalController();
const getAllJournalsController = MakeGetAllJournalsController();
const getJournalByIdController = MakeGetJournalByIdController();
const getUserJournalsController = MakeGetUserJournalsController();
const updateJournalController = MakeUpdateJournalController();
const deleteJournalController = MakeDeleteJournalController();

const prismaAuthRepository = new PrismaAuthRepository();

routerJournals.post(
  "/",
  protectAuth(prismaAuthRepository),
  validate(CreateJournalSchema),
  createJournalController.handle,
);

routerJournals.get(
  "/",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  getAllJournalsController.handle,
);

routerJournals.get(
  "/my-journals",
  protectAuth(prismaAuthRepository),
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
  validate(updateJournalSchema),
  updateJournalController.handle,
);

routerJournals.delete(
  "/:id",
  protectAuth(prismaAuthRepository),
  deleteJournalController.handle,
);

export { routerJournals as journalsRoutes };
