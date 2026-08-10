import { CloudinaryRepository } from "shared/uploads/cloudinary.repository.js";
import { CreateJournalController } from "../controllers/create-journal.controller.js";
import { DeleteJournalController } from "../controllers/delete-journal.controller.js";
import { GetJournalByIdController } from "../controllers/get-journalById.controller.js";
import { GetJournalsController } from "../controllers/get-journals.controller.js";
import { GetUserJournalsController } from "../controllers/get-userJournals.controller.js";
import { UpdateJournalController } from "../controllers/update-journal.controller.js";
import { PrismaJournalRepository } from "../repository/prisma.repository.js";
import { CreateJournalService } from "../services/create-journal.service.js";
import { DeleteJournalService } from "../services/delete-journal.service.js";
import { GetJournalByIdService } from "../services/get-journalById.service.js";
import { GetAllJournalsService } from "../services/get-journals.service.js";
import { GetUserJournalsService } from "../services/get-userJournals.service.js";
import { UpdateJournalService } from "../services/update-journal.service.js";
import { DeleteAttachmentService } from "../services/delete-attachment.service.js";
import { DeleteAttachmentController } from "../controllers/delete-attachment.controller.js";

const journalRepository = new PrismaJournalRepository();
const uploadRepository = new CloudinaryRepository();

export const MakeCreateJournalController = () => {
  const createJournalService = new CreateJournalService(
    journalRepository,
    uploadRepository,
  );
  const createJournalController = new CreateJournalController(
    createJournalService,
  );

  return createJournalController;
};

export const MakeGetAllJournalsController = () => {
  const getAllJournalsService = new GetAllJournalsService(journalRepository);
  const getAllJournalsController = new GetJournalsController(
    getAllJournalsService,
  );
  return getAllJournalsController;
};

export const MakeGetJournalByIdController = () => {
  const getJournalByIdService = new GetJournalByIdService(journalRepository);
  const getJournalByIdController = new GetJournalByIdController(
    getJournalByIdService,
  );

  return getJournalByIdController;
};

export const MakeGetUserJournalsController = () => {
  const getUserJournalsService = new GetUserJournalsService(journalRepository);
  const getUserJournalsController = new GetUserJournalsController(
    getUserJournalsService,
  );
  return getUserJournalsController;
};

export const MakeUpdateJournalController = () => {
  const updateJournalService = new UpdateJournalService(
    journalRepository,
    uploadRepository,
  );
  const updateJournalController = new UpdateJournalController(
    updateJournalService,
  );

  return updateJournalController;
};

export const MakeDeleteJournalController = () => {
  const deleteJournalService = new DeleteJournalService(journalRepository);
  const deleteJournalController = new DeleteJournalController(
    deleteJournalService,
  );

  return deleteJournalController;
};

export const MakeDeleteAttachmentController = () => {
  const deleteAttachmentService = new DeleteAttachmentService(
    journalRepository,
    uploadRepository,
  );
  const deleteAttachmentController = new DeleteAttachmentController(
    deleteAttachmentService,
  );

  return deleteAttachmentController;
};
