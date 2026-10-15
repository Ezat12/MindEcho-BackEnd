import { CloudinaryRepository } from "shared/uploads/cloudinary.repository.js";

import { PrismaLibraryRepository } from "../repository/prisma.repository.js";
import { PrismaMoodRepository } from "modules/mood/repository/prisma.repository.js";
import { PrismaCategoryLibraryRepository } from "modules/category-library/repository/prisma.repository.js";

import { CreateLibraryController } from "../controllers/create-library.controller.js";
import { UpdateLibraryController } from "../controllers/update-library.controller.js";
import { GetAllLibraryController } from "../controllers/get-all-library.controller.js";

import { DeleteLibraryController } from "../controllers/delete-library.controller.js";

import { CreateLibraryService } from "../services/create-library.service.js";
import { UpdateLibraryService } from "../services/update-library.service.js";
import { GetAllLibraryService } from "../services/get-all-library.service.js";
import { GetByIdLibraryService } from "../services/get-byId-library.service.js";
import { DeleteLibraryService } from "../services/delete-library.service.js";
import { GetByIdLibraryController } from "../controllers/get-byId-library.controller.js";

const libraryRepository = new PrismaLibraryRepository();
const moodRepository = new PrismaMoodRepository();
const categoryLibraryRepository = new PrismaCategoryLibraryRepository();
const uploadRepository = new CloudinaryRepository();

export const MakeCreateLibraryController = () => {
  const createLibraryService = new CreateLibraryService(
    libraryRepository,
    moodRepository,
    uploadRepository,
  );

  return new CreateLibraryController(createLibraryService);
};

export const MakeUpdateLibraryController = () => {
  const updateLibraryService = new UpdateLibraryService(
    libraryRepository,
    moodRepository,
    categoryLibraryRepository,
    uploadRepository,
  );

  return new UpdateLibraryController(updateLibraryService);
};

export const MakeGetAllLibraryController = () => {
  const getAllLibraryService = new GetAllLibraryService(libraryRepository);

  return new GetAllLibraryController(getAllLibraryService);
};

export const MakeGetByIdLibraryController = () => {
  const getByIdLibraryService = new GetByIdLibraryService(libraryRepository);

  return new GetByIdLibraryController(getByIdLibraryService);
};

export const MakeDeleteLibraryController = () => {
  const deleteLibraryService = new DeleteLibraryService(libraryRepository);

  return new DeleteLibraryController(deleteLibraryService);
};
