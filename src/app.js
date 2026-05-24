import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import env from "../config/env.js";
import AppError from "./utils/AppError.js";
import {globalErrorHandler} from "./middlewares/errorHandler.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import eventRouter from "./routes/eventRoutes.js";

const app = express();

app.use(cors());

app.use(helmet());
const limiter = rateLimit({
  limit: 100,
  windowMs: 1000 * 60 * 60,
  message: "Too many request! Please try again after 1 hour",
});
app.use("/api", limiter);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);

app.use(globalErrorHandler);

export default app;
