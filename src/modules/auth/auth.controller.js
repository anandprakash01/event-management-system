import jwt from "jsonwebtoken";

import {asyncHandler} from "../../utils/asyncHandler.js";
import {AppError} from "../../utils/AppError.js";
import {User} from "../user/user.model.js";
import {env} from "../../config/env.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const registerUser = asyncHandler(async (req, res, next) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    throw new AppError(400, "All fields are required!");
  }

  const isAlreadyRegistered = await User.exists({email});

  if (isAlreadyRegistered) {
    throw new AppError(400, "Email already registered!");
  }

  const newUser = await User.create({name, email, password});

  const payload = {id: newUser._id};
  const token = jwt.sign(payload, env.JWT_SECRET_KEY, {expiresIn: env.JWT_EXPIRE});

  res.cookie("jwt", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "Email registered successfully",
    data: {
      user: {
        name,
        email,
      },
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    throw new AppError(400, "All fields are required!");
  }

  const isUser = await User.exists({email});
  if (!isUser) {
    throw new AppError(400, "Email not registered!");
  }

  const user = await User.findOne({email}).select(
    "+password +failedLoginAttempts +accountLockedUntil",
  );

  if (user.accountLockedUntil && user.accountLockedUntil > Date.now()) {
    const timeLeft = Math.ceil((user.accountLockedUntil - Date.now()) / 60000);
    throw new AppError(
      403,
      `Account temporary locked due to multiple failed attempts. Try again in ${timeLeft} minutes`,
    );
  }

  if (!(await user.matchPassword(password))) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= 5) {
      user.accountLockedUntil = Date.now() + 15 * 60 * 1000;
    }
    await user.save({validateBeforeSave: false});
    throw new AppError(401, "Invalid credentials!");
  }

  user.failedLoginAttempts = 0;
  user.accountLockedUntil = undefined;
  await user.save({validateBeforeSave: false});

  const payload = {id: user._id};
  const token = jwt.sign(payload, env.JWT_SECRET_KEY, {expiresIn: env.JWT_EXPIRE});

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Successfully loggedIn",
    data: {
      user: {
        token,
        name: user.name,
        email: user.email,
        role: user.role,
        _id: user._id,
      },
    },
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    ...cookieOptions,
    maxAge: 1000,
  });

  res.status(200).json({
    success: true,
    message: "Successfully loggedOut",
  });
});

export {registerUser, loginUser, logoutUser};
