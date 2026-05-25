import jwt from "jsonwebtoken";

import User from "../modules/users/user.model.js";
import env from "../../config/env.js";
import AppError from "../utils/AppError.js";

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Bearer token found!");
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
    console.log("Cookie token found!");
  }

  if (!token) {
    throw new AppError(401, "You are not logged in. Please log in to get access.");
  }

  const decodedToken = jwt.verify(token, env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decodedToken.id).select("-__v");

  if (!currentUser) {
    throw new AppError(401, "The user belonging to this token no longer exists.");
  }

  req.user = currentUser;
  next();
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        403,
        "You do not have permission, Only admin can perform this action",
      );
    }
    next();
  };
};

export {protect, restrictTo};
