import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";

import { router } from "./routes/index.js";
import { errorHandler } from "./shared/http/error-handler.js";
import { AppError } from "shared/errors/app-error.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    message: "MindEcho API is running",
  });
});

app.use("/api/v1", router);
app.use(errorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

export { app };
