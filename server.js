import http from "http";
import cluster from "cluster";
import os from "os";

import env from "./config/env.js";
import connectDB from "./config/db.js";
import app from "./src/app.js";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`[PRIMARY] Process (PID: ${process.pid}) is booting...`);
  console.log(`[PRIMARY] Detecting ${numCPUs} CPUs cores, forking workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `[CRASH] Worker ${worker.process.id} exited with code: ${code}, Booting replacement...`,
    );
    cluster.fork();
  });
} else {
  const server = http.createServer(app);

  const startServer = async () => {
    await connectDB();

    server.listen(env.PORT, () => {
      // console.log(`[SERVER] ${env.NODE_ENV} mode started on port: ${env.PORT}`);
      console.log(
        `[WORKER ${cluster.worker.id}] (PID: ${process.pid}) listening on port: ${env.PORT} in [${env.NODE_ENV}] mode`,
      );
    });
  };

  startServer();

  process.on("uncaughtException", err => {
    console.log(`[ERROR] UNCAUGHT EXCEPTION, Shutting down...`);
    console.warn(err.message);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    console.log(`[ERROR] UNHANDLED REJECTION, Shutting down...`);
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
}
