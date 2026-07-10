import { Router } from "express";

import { userRoutes } from "../modules/users/routes/user.routes.js";
import { authRoutes } from "../modules/auth/routes/auth.route.js";
import { journalsRoutes } from "../modules/journals/routes/journals.route.js";

const router = Router();

router.use("/users", userRoutes);

router.use("/auth", authRoutes);

router.use("/journals", journalsRoutes);

export { router };
