import express from "express";

import {
  MakeCreateSpecializationController,
  MakeDeleteSpecializationController,
  MakeGetAllSpecializationsController,
  MakeGetSpecializationByIdController,
  MakeUpdateSpecializationController,
} from "../design/factory-specialization-route.js";

import { protectAuth } from "middlewares/protectAuth.js";
import { allowedTo } from "middlewares/allowedTo.js";
import { validate } from "middlewares/validate-zod.js";
import { PrismaAuthRepository } from "modules/auth/repository/prisma-repository.js";

import { createSpecializationSchema } from "../dto/create-specialization.dto.js";
import { updateSpecializationSchema } from "../dto/update-specialization.dto.js";
import { IdParamSchema } from "../dto/id-params.schema.js";

const routerSpecialization = express.Router();

const createSpecializationController = MakeCreateSpecializationController();
const getAllSpecializationsController = MakeGetAllSpecializationsController();
const getSpecializationByIdController = MakeGetSpecializationByIdController();
const updateSpecializationController = MakeUpdateSpecializationController();
const deleteSpecializationController = MakeDeleteSpecializationController();

const prismaAuthRepository = new PrismaAuthRepository();

routerSpecialization.post(
  "/",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  validate(createSpecializationSchema),
  createSpecializationController.handle,
);

routerSpecialization.get(
  "/",
  protectAuth(prismaAuthRepository),
  getAllSpecializationsController.handle,
);

routerSpecialization.get(
  "/:id",
  protectAuth(prismaAuthRepository),
  validate(IdParamSchema, "params"),
  getSpecializationByIdController.handle,
);

routerSpecialization.put(
  "/:id",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  validate(IdParamSchema, "params"),
  validate(updateSpecializationSchema),
  updateSpecializationController.handle,
);

routerSpecialization.delete(
  "/:id",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  validate(IdParamSchema, "params"),
  deleteSpecializationController.handle,
);

export { routerSpecialization as specializationsRoutes };
