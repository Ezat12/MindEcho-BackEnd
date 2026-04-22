import cors from "cors";
import express from "express";

import { router } from "./routes/index.js";
import { errorHandler } from "./shared/http/error-handler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "MindEcho API is running",
  });
});

app.use("/api/v1", router);
app.use(errorHandler);

export { app };
