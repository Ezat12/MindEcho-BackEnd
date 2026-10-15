import express from "express";

import {
  MakeCreateLibraryController,
  MakeUpdateLibraryController,
  MakeGetAllLibraryController,
  MakeGetByIdLibraryController,
  MakeDeleteLibraryController,
} from "../design/factory-library-route.js";

import { validate } from "middlewares/validate-zod.js";
import { protectAuth } from "middlewares/protectAuth.js";
import { allowedTo } from "middlewares/allowedTo.js";
import { PrismaAuthRepository } from "modules/auth/repository/prisma-repository.js";
import upload from "middlewares/upload.js";

import { createLibrarySchema } from "../dto/created-library.dto.js";
import { updateLibrarySchema } from "../dto/update-library.dto.js";
import { paginationLibrarySchema } from "../dto/pagination-library.dto.js";

const routerLibrary = express.Router();

const createLibraryController = MakeCreateLibraryController();
const updateLibraryController = MakeUpdateLibraryController();
const getAllLibraryController = MakeGetAllLibraryController();
const getByIdLibraryController = MakeGetByIdLibraryController();
const deleteLibraryController = MakeDeleteLibraryController();

const prismaAuthRepository = new PrismaAuthRepository();

routerLibrary.post(
  "/",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resource", maxCount: 1 },
  ]),
  validate(createLibrarySchema, "body"),
  createLibraryController.handle,
);

routerLibrary.get(
  "/",
  validate(paginationLibrarySchema, "query"),
  getAllLibraryController.handle,
);

routerLibrary.get("/:id", getByIdLibraryController.handle);

routerLibrary.put(
  "/:id",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resource", maxCount: 1 },
  ]),
  validate(updateLibrarySchema, "body"),
  updateLibraryController.handle,
);

routerLibrary.delete(
  "/:id",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  deleteLibraryController.handle,
);

export { routerLibrary as libraryRoutes };
