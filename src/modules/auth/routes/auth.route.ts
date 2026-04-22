import express from "express";
import type { Request, Response } from "express";
import { validate } from "../../../middlewares/validate-zod.js";
import { registerUserSchema } from "../dto/register-user.dto.js";
import {
  authRepository,
  MakeLoginController,
  MakeProfileController,
  MakeRegisterController,
} from "../design/factory-auth-route.js";
import { protectAuth } from "middlewares/protectAuth.js";
import { asyncHandler } from "middlewares/async-handler.js";
const router = express.Router();

const registerController = MakeRegisterController();
const loginController = MakeLoginController();
const profileController = MakeProfileController();

router.post(
  "/register",
  validate(registerUserSchema),
  asyncHandler(registerController.handle),
);

router.post("/login", asyncHandler(loginController.handle));

router.get(
  "/profile",
  protectAuth(authRepository),
  asyncHandler(profileController.handle),
);

export { router as authRoutes };
