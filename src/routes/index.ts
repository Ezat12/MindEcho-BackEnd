import { Router } from "express";

import { userRoutes } from "../modules/users/routes/user.routes.js";
import { authRoutes } from "../modules/auth/routes/auth.route.js";
import { journalsRoutes } from "../modules/journals/routes/journals.route.js";
import { moodsRoutes } from "../modules/mood/routes/mood.route.js";
import { categoryLibraryRoutes } from "../modules/category-library/routes/category-library.route.js";

const router = Router();

router.use("/users", userRoutes);

router.use("/auth", authRoutes);

router.use("/moods", moodsRoutes);

router.use("/journals", journalsRoutes);

router.use("category-library", categoryLibraryRoutes);

export { router };
