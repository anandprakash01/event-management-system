import User from "../models/User.js";
import AppError from "../utils/AppError.js";

const getProfile = async (req, res) => {
  res.status(201).json({
    success: true,
    message: "User fetched successfully",
    data: {
      user: req.user,
    },
  });
};

export {getProfile};
