import express from "express";

import {
  MakeAssignSpecializationController,
  MakeGetDoctorsBySpecializationController,
  MakeGetSpecializationsByDoctorController,
  MakeRemoveSpecializationByPairController,
  MakeRemoveSpecializationController,
} from "../design/factory-doctor-specialization-route.js";

import { protectAuth } from "middlewares/protectAuth.js";
import { allowedTo } from "middlewares/allowedTo.js";
import { validate } from "middlewares/validate-zod.js";
import { PrismaAuthRepository } from "modules/auth/repository/prisma-repository.js";

import { assignSpecializationSchema } from "../dto/assign-specialization.dto.js";
import {
  doctorIdParamSchema,
  doctorSpecializationPairParamSchema,
  IdParamSchema,
  specializationIdParamSchema,
} from "../dto/id-params.schema.js";

const routerDoctorSpecialization = express.Router();

const assignSpecializationController = MakeAssignSpecializationController();
const removeSpecializationController = MakeRemoveSpecializationController();
const removeSpecializationByPairController =
  MakeRemoveSpecializationByPairController();
const getSpecializationsByDoctorController =
  MakeGetSpecializationsByDoctorController();
const getDoctorsBySpecializationController =
  MakeGetDoctorsBySpecializationController();

const prismaAuthRepository = new PrismaAuthRepository();

routerDoctorSpecialization.post(
  "/",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  validate(assignSpecializationSchema),
  assignSpecializationController.handle,
);

routerDoctorSpecialization.get(
  "/by-doctor/:doctorId",
  protectAuth(prismaAuthRepository),
  validate(doctorIdParamSchema, "params"),
  getSpecializationsByDoctorController.handle,
);

routerDoctorSpecialization.get(
  "/by-specialization/:specializationId",
  protectAuth(prismaAuthRepository),
  validate(specializationIdParamSchema, "params"),
  getDoctorsBySpecializationController.handle,
);

routerDoctorSpecialization.delete(
  "/by-doctor/:doctorId/specialization/:specializationId",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  validate(doctorSpecializationPairParamSchema, "params"),
  removeSpecializationByPairController.handle,
);

routerDoctorSpecialization.delete(
  "/:id",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  validate(IdParamSchema, "params"),
  removeSpecializationController.handle,
);

export { routerDoctorSpecialization as doctorSpecializationRoutes };
