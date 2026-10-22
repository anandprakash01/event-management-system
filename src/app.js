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
// Express thinks the direct connection (Render's load balancer) is the user. Everyone shares the same IP, which breaks rate limiters.
// With "trust proxy", 1: Express knows there is exactly 1 proxy in front of it. It reads the X-Forwarded-For header provided by Render and correctly assigns req.ip to the actual user's IP address.

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

// Base Route
app.get("/", (req, res) => {
  if (req.accepts("html")) {
    return res.status(200)
      .send(`<div style="font-family: system-ui; text-align: center; padding-top: 50px;">
      <h1 style="color: #3b82f6;">🎫 Event Management API is Online</h1>
      <p>System is running securely in ${process.env.NODE_ENV} mode.</p>
      <a href="https://github.com/anandprakash01/event-management-system" style="color: #0f172a;">View Documentation</a>
    </div>`);
  }
  res.status(200).json({
    success: true,
    message: "System is running",
  });
});

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
