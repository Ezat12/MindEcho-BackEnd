import express from "express";

import {
  MakeCreateDoctorController,
  MakeDeleteDoctorController,
  MakeGetAllDoctorsController,
  MakeGetDoctorByIdController,
  MakeUpdateDoctorController,
} from "../design/factory-doctor-route.js";

import { protectAuth } from "middlewares/protectAuth.js";
import { allowedTo } from "middlewares/allowedTo.js";
import { validate } from "middlewares/validate-zod.js";
import { PrismaAuthRepository } from "modules/auth/repository/prisma-repository.js";

import { createDoctorSchema } from "../dto/create-doctor.dto.js";
import { updateDoctorSchema } from "../dto/update-doctor.dto.js";
import { IdParamSchema } from "../dto/id-params.schema.js";
import { paginationDoctorSchema } from "../dto/pagination-doctor.dto.js";

const routerDoctor = express.Router();

const createDoctorController = MakeCreateDoctorController();
const getAllDoctorsController = MakeGetAllDoctorsController();
const getDoctorByIdController = MakeGetDoctorByIdController();
const updateDoctorController = MakeUpdateDoctorController();
const deleteDoctorController = MakeDeleteDoctorController();

const prismaAuthRepository = new PrismaAuthRepository();

routerDoctor.post(
  "/",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  validate(createDoctorSchema),
  createDoctorController.handle,
);

routerDoctor.get(
  "/",
  protectAuth(prismaAuthRepository),

  validate(paginationDoctorSchema, "query"),
  getAllDoctorsController.handle,
);

routerDoctor.get(
  "/:id",
  protectAuth(prismaAuthRepository),
  validate(IdParamSchema, "params"),
  getDoctorByIdController.handle,
);

routerDoctor.put(
  "/:id",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN", "DOCTOR"]),
  validate(IdParamSchema, "params"),
  validate(updateDoctorSchema),
  updateDoctorController.handle,
);

routerDoctor.delete(
  "/:id",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN"]),
  validate(IdParamSchema, "params"),
  deleteDoctorController.handle,
);

export { routerDoctor as doctorsRoutes };
