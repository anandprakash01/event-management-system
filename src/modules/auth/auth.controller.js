import jwt from "jsonwebtoken";

import User from "../users/user.model.js";
import AppError from "../../utils/AppError.js";
import env from "../../../config/env.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  // maxAge: 1000 * 60, // 1 min
};

const registerUser = async (req, res) => {
  const {name, email, password, role, age} = req.body;

  if (!name || !email || !password || !age) {
    throw new AppError(400, "All fields are required");
  }
  if (age < 15) {
    throw new AppError(400, "Age should be more than 15 years");
  } else if (age > 65) {
    throw new AppError(400, "User should be below 65 to attend the event");
  }

  if (role && (role !== "user" || role !== "admin")) {
    throw new AppError(400, "Invalid role type: Please use 'admin' or 'user'");
  }

  const alreadyRegistered = await User.findOne({email});

  if (alreadyRegistered) {
    throw new AppError(400, "User already registered!");
  }
  const userData = {
    name,
    email,
    role,
    age,
    password,
  };
  const newUser = await User.create(userData);

  const tokenPayload = {id: newUser._id};
  const token = jwt.sign(tokenPayload, env.JWT_SECRET_KEY, {expiresIn: env.JWT_EXPIRE});

  res.cookie("jwt", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        age: newUser.age,
      },
    },
  });
};
const loginUser = async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    throw new AppError(400, "Please provide an email and password");
  }

  const user = await User.findOne({email}).select(
    "+password +failedLoginAttempts +accountLockedUntil",
  );

  if (!user) {
    throw new AppError(401, "Email not registered!"); // unauthorized-401
  }

  if (user.accountLockedUntil && user.accountLockedUntil > Date.now()) {
    const timeLeft = Math.ceil((user.accountLockedUntil - Date.now()) / 60000);
    throw new AppError(
      403,
      `Account temporarily locked due to multiple failed attempts. Try again in ${timeLeft} minutes.`,
    ); // 403 Forbidden
  }

  if (!(await user.matchPassword(password))) {
    user.failedLoginAttempts += 1;
    let message = "Incorrect email or password!";
    if (user.failedLoginAttempts > 5) {
      user.accountLockedUntil = Date.now() + 1000 * 60 * 15;
      message = "Incorrect email or password! account temporary locked for 15 minutes";
    }
    await user.save({validateBeforeSave: false});
    throw new AppError(401, message);
  }
  user.failedLoginAttempts = 0;
  user.accountLockedUntil = undefined;
  await user.save({validateBeforeSave: false});

  const tokenPayload = {id: user._id};
  const token = jwt.sign(tokenPayload, env.JWT_SECRET_KEY, {expiresIn: env.JWT_EXPIRE});

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Successfully logged in",
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
      },
    },
  });
};

const logoutUser = async (req, res) => {
  res.cookie("jwt", "", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully!",
    data: {
      user: req.user,
    },
  });
};

export {registerUser, loginUser, logoutUser};
