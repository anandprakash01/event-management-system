import mongoose from "mongoose";
import {env} from "./env.js";

mongoose.connection.on("error", err => {
  console.log(`[ERROR] [DB] MongoDB connection encountered an error: `, err);
});

mongoose.connection.on("disconnected", () => {
  console.log(
    `[WARN ] [DB] mongoDB cluster disconnected at ${new Date().toLocaleString()}, attempting to reconnect...`,
  );
});

mongoose.connection.on("reconnected", () => {
  console.log(
    `[INFO ] [DB] mongoDB cluster reconnected at ${new Date().toLocaleString()}`,
  );
});

// mongoose.set("sanitizeFilter", true);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`[INFO ] [DB] mongoDB cluster connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`[FATAL] [DB] initial mongoDB connection failed`);
    console.log(err.message);
    process.exit(1);
  }
};

export default connectDB;
