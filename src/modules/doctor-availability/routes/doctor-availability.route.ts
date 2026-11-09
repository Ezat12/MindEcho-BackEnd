import express from "express";

import {
  MakeCreateDoctorAvailabilityController,
  MakeDeleteDoctorAvailabilityController,
  MakeGetAllDoctorAvailabilityController,
  MakeGetDoctorAvailabilityByIdController,
  MakeGetMyDoctorAvailabilityController,
  MakeUpdateDoctorAvailabilityController,
} from "../design/factory-doctor-availability.js";

import { protectAuth } from "middlewares/protectAuth.js";
import { allowedTo } from "middlewares/allowedTo.js";
import { validate } from "middlewares/validate-zod.js";
import { PrismaAuthRepository } from "modules/auth/repository/prisma-repository.js";

import { createDoctorAvailabilitySchema } from "../dto/create-doctor-availability.schema.js";
import { updateDoctorAvailabilitySchema } from "../dto/update-doctor-availability.schema.js";
import { doctorIdParamSchema } from "modules/doctor-specialization/dto/id-params.schema.js";
import { doctorAvailabilityIdParamSchema } from "../dto/id-params.schema.js";

const routerDoctorAvailability = express.Router();

const createDoctorAvailabilityController =
  MakeCreateDoctorAvailabilityController();

const getAllDoctorAvailabilityController =
  MakeGetAllDoctorAvailabilityController();

const getDoctorAvailabilityByIdController =
  MakeGetDoctorAvailabilityByIdController();

const updateDoctorAvailabilityController =
  MakeUpdateDoctorAvailabilityController();

const deleteDoctorAvailabilityController =
  MakeDeleteDoctorAvailabilityController();

const getMyDoctorAvailabilityController =
  MakeGetMyDoctorAvailabilityController();

const prismaAuthRepository = new PrismaAuthRepository();

// Create availability
routerDoctorAvailability.post(
  "/",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN", "DOCTOR"]),
  validate(createDoctorAvailabilitySchema),
  createDoctorAvailabilityController.handle,
);

// Get all availability for a doctor
routerDoctorAvailability.get(
  "/doctor/:doctorId",
  protectAuth(prismaAuthRepository),
  validate(doctorIdParamSchema, "params"),
  getAllDoctorAvailabilityController.handle,
);

// Get my availability
routerDoctorAvailability.get(
  "/my-availability",
  protectAuth(prismaAuthRepository),
  allowedTo(["DOCTOR"]),
  getMyDoctorAvailabilityController.handle,
);

// Get availability by ID
routerDoctorAvailability.get(
  "/:doctorAvailabilityId",
  protectAuth(prismaAuthRepository),
  validate(doctorAvailabilityIdParamSchema, "params"),
  getDoctorAvailabilityByIdController.handle,
);

// Update availability
routerDoctorAvailability.put(
  "/:doctorAvailabilityId",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN", "DOCTOR"]),
  validate(updateDoctorAvailabilitySchema, "body"),
  validate(doctorAvailabilityIdParamSchema, "params"),
  updateDoctorAvailabilityController.handle,
);

// Delete availability
routerDoctorAvailability.delete(
  "/:doctorAvailabilityId",
  protectAuth(prismaAuthRepository),
  allowedTo(["ADMIN", "DOCTOR"]),
  validate(doctorAvailabilityIdParamSchema, "params"),
  deleteDoctorAvailabilityController.handle,
);

export { routerDoctorAvailability as doctorAvailabilityRoutes };
