import express from "express";
import { protectAuth } from "middlewares/protectAuth.js";

const router = express.Router();

router.get("/", protectAuth);

export default router;
