import {env} from "../config/env.js";

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let isOperational = err.isOperational || false;

  // ===== MongoDB errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    statusCode = 400;
    const message = `${field} already is use, please use another`;
    isOperational = true;
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid data format provided for the field: ${err.path}`;
    isOperational = true;
  }
  if (err.name === "ValidationError") {
    const errorMessages = Object.values(err.errors).map(val => val.message);

    statusCode = 400;
    message = `Invalid input data: ${errorMessages.join(", ")}`;
    isOperational = true;
  }

  // ===== jwt errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token, Please login to get access";
    isOperational = true;
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired, please login again";
    isOperational = true;
  }

  if (err.name === "NotBeforeError") {
    statusCode = 401;
    message = "Token is not active yet, please wait";
    isOperational = true;
  }

  if (env.NODE_ENV !== "production") {
    const logTag = statusCode >= 500 ? `[ERROR]` : `[WARN ]`;
    console.log(`${logTag} [EXPRESS] ${message}`);

    return res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
    });
  }

  if (isOperational) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  console.log(`[ERROR] [PROGRAMMING BUG] :`, err);

  res.status(500).json({
    success: false,
    message: "Something went wrong, please try again later",
  });
};

export {globalErrorHandler};
