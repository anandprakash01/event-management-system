import env from "../../config/env.js";

const globalErrorHandler = (err, req, res, next) => {
  console.error(`🚨 [CRASH CAUGHT]: ${err.message}`);
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // const customError = {
  //   statusCode: err.statusCode || 500,
  //   message: "Internal Server Error",
  // };

  // ===== DB errors

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} is already in use, Please use another one.`;
    if (field === "event") {
      message = `you have already registered this ${field}.`;
    }
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid data format provided for the field ${err.path}`;
  }

  if (err.name === "ValidationError") {
    const errMessages = Object.values(err.errors).map(val => val.message);
    statusCode = 400;
    message = `Invalid Input data: ${errMessages.join(" ,")}`;
  }

  // ===== JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token! Please login again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token Expired! Please login again.";
  }
  if (err.name === "NotBeforeError") {
    statusCode = 401;
    message = "Token is not active yet!";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export {globalErrorHandler};
