import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import {globalErrorHandler} from "./middleware/error.middleware.js";

import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";
import eventRouter from "./modules/event/event.routes.js";

const app = express();

// Added this line so Express trusts Render's proxy
app.set("trust proxy", 1);

app.use(cors());
app.use(helmet());

const limiter = rateLimit({
  limit: 100,
  windowMs: 1000 * 60 * 15,
  legacyHeaders: false,
  standardHeaders: true,
  message: "Too many request, try after some time.",
});

app.use("/api", limiter);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);

//The 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Error 404, Not found",
  });
});

app.use(globalErrorHandler);

export default app;
