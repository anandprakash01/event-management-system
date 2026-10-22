import http from "http";

import "./utils/crashHandler.js";
import {env} from "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";

const server = http.createServer(app);

server.on("error", err => {
  console.log(`[FATAL] [SERVER] server startup error, Shutting down...`);
  console.log(err.message);
  process.exit(1);
});

const startServer = async () => {
  await connectDB();

  server.listen(env.PORT, () => {
    console.log(
      `[INFO ] [SERVER] ${env.NODE_ENV} mode server started on ${env.PORT} Port.`,
    );
  });
};

startServer();

process.on("unhandledRejection", () => {
  console.log(`[FATAL] [PROCESS] unhandledRejection, shutting down...`);
  console.log(err.name, err.message, err.stack);
  if (server.listening) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
