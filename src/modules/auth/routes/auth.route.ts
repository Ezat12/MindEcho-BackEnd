import express from "express";
import type { Request, Response } from "express";
import { validate } from "../../../middlewares/validate-zod.js";
import { registerUserSchema } from "../dto/register-user.dto.js";
import {
  MakeLoginController,
  MakeRegisterController,
} from "../design/factory-auth-route.js";
const router = express.Router();

const makeRegisterController = MakeRegisterController();
const makeLoginController = MakeLoginController();

router.post(
  "/register",
  validate(registerUserSchema),
  (req: Request, res: Response) => makeRegisterController.handle(req, res),
);

router.post("/login", (req: Request, res: Response) =>
  makeLoginController.handle(req, res),
);

export { router as authRoutes };
