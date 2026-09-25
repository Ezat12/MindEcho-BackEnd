import express from "express";

import {
  MakeCreateCategoryLibraryController,
  MakeGetAllCategoryLibraryController,
  MakeGetCategoryLibraryByIdController,
  MakeUpdateCategoryLibraryController,
  MakeDeleteCategoryLibraryController,
} from "../design/factory-category-library-route.js";

import { protectAuth } from "middlewares/protectAuth.js";
import { allowedTo } from "middlewares/allowedTo.js";
import { validate } from "middlewares/validate-zod.js";

import { createCategorySchema } from "../dto/create-category.dto.js";
import { updateCategorySchema } from "../dto/update-category.dto.js";

import { PrismaAuthRepository } from "modules/auth/repository/prisma-repository.js";

const routerCategoryLibrary = express.Router();

const createCategoryLibraryController = MakeCreateCategoryLibraryController();

const getAllCategoryLibraryController = MakeGetAllCategoryLibraryController();

const getCategoryLibraryByIdController = MakeGetCategoryLibraryByIdController();

const updateCategoryLibraryController = MakeUpdateCategoryLibraryController();

const deleteCategoryLibraryController = MakeDeleteCategoryLibraryController();

const prismaAuthRepository = new PrismaAuthRepository();

routerCategoryLibrary.post(
  "/",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  validate(createCategorySchema),
  createCategoryLibraryController.handle,
);

routerCategoryLibrary.get(
  "/",
  protectAuth(prismaAuthRepository),
  getAllCategoryLibraryController.handle,
);

routerCategoryLibrary.get(
  "/:id",
  protectAuth(prismaAuthRepository),
  getCategoryLibraryByIdController.handle,
);

routerCategoryLibrary.put(
  "/:id",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  validate(updateCategorySchema),
  updateCategoryLibraryController.handle,
);

routerCategoryLibrary.delete(
  "/:id",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  deleteCategoryLibraryController.handle,
);

export { routerCategoryLibrary as categoryLibraryRoutes };
