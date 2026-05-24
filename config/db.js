import mongoose from "mongoose";

import env from "../config/env.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`[DATABASE] MongoDB Cluster Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`[DATABASE CRASH] Initial connection failed!`);
    console.log(err.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log(
    `⚠️ [DATABASE] TCP connection lost at ${new Date().toLocaleString()}, Attempting to reconnect...`,
  );
});
mongoose.connection.on("reconnected", () => {
  console.log(`✅ [DATABASE] TCP connection restored at ${new Date().toLocaleString()}`);
});

export default connectDB;
