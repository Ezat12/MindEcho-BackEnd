import { CreateCategoryLibraryController } from "../controllers/create-category-library.controller.js";
import { GetAllCategoryLibraryController } from "../controllers/get-all-category-library.controller.js";
import { getCategoryLibraryByIdController } from "../controllers/get-byId-category-library.controller.js";
import { updateCategoryLibraryController } from "../controllers/update-category-library.controller.js";
import { deleteCategoryLibraryController } from "../controllers/delete-category-library.controller.js";

import { PrismaCategoryLibraryRepository } from "../repository/prisma.repository.js";

import { CreateCategoryLibraryService } from "../services/create-category-library.service.js";
import { GetAllCategoryLibraryService } from "../services/get-all-category-library.service.js";
import { getCategoryLibraryByIdService } from "../services/get-byId-category-library.service.js";
import { updateCategoryLibraryService } from "../services/update-category-library.service.js";
import { DeleteCategoryLibraryService } from "../services/delete-category-library.service.js";

const categoryLibraryRepository = new PrismaCategoryLibraryRepository();

export const MakeCreateCategoryLibraryController = () => {
  const service = new CreateCategoryLibraryService(categoryLibraryRepository);

  return new CreateCategoryLibraryController(service);
};

export const MakeGetAllCategoryLibraryController = () => {
  const service = new GetAllCategoryLibraryService(categoryLibraryRepository);

  return new GetAllCategoryLibraryController(service);
};

export const MakeGetCategoryLibraryByIdController = () => {
  const service = new getCategoryLibraryByIdService(categoryLibraryRepository);

  return new getCategoryLibraryByIdController(service);
};

export const MakeUpdateCategoryLibraryController = () => {
  const service = new updateCategoryLibraryService(categoryLibraryRepository);

  return new updateCategoryLibraryController(service);
};

export const MakeDeleteCategoryLibraryController = () => {
  const service = new DeleteCategoryLibraryService(categoryLibraryRepository);

  return new deleteCategoryLibraryController(service);
};
