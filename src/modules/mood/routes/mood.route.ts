import express from "express";
import { protectAuth } from "middlewares/protectAuth.js";
import {
  MakeCreateMoodController,
  MakeGetAllMoodsController,
  MakeGetMoodByIdController,
} from "../design/factory-mood-route.js";
import { validate } from "middlewares/validate-zod.js";
import { addMoodSchema } from "../dto/add-mood.dto.js";
import { allowedTo } from "middlewares/allowedTo.js";
import { PrismaAuthRepository } from "modules/auth/repository/prisma-repository.js";

const authRepository = new PrismaAuthRepository();

const makeCreateMoodController = MakeCreateMoodController();
const makeGetAllMoodsController = MakeGetAllMoodsController();
const makeGetMoodByIdController = MakeGetMoodByIdController();

const router = express.Router();

router.post(
  "/",
  protectAuth(authRepository),
  allowedTo(["ADMIN"]),
  validate(addMoodSchema),
  makeCreateMoodController.handle,
);

router.get("/", protectAuth(authRepository), makeGetAllMoodsController.handle);
router.get(
  "/:id",
  protectAuth(authRepository),
  makeGetMoodByIdController.handle,
);

export { router as moodsRoutes };
