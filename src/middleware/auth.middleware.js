import jwt from "jsonwebtoken";

import {AppError} from "../utils/AppError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {env} from "../config/env.js";
import {User} from "../modules/user/user.model.js";

const protect = asyncHandler(async (req, res, next) => {
  const queryParams = req.query;
  const param = req.params;

  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Bearer token found!");
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
    console.log("Cookie token found!");
  }

  const decoded = jwt.verify(token, env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decoded.id).select("-__v");

  if (!currentUser) {
    throw new AppError(401, "Invalid token, please login");
  }

  req.user = currentUser;
  next();
});

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
