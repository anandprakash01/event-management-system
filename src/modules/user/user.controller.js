import {asyncHandler} from "../../utils/asyncHandler.js";
import {AppError} from "../../utils/AppError.js";
import {User} from "./user.model.js";

const getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Profile data fetched successfully",
    data: {
      user: {
        name: req.user.name,
        email: req.user.email,
        _id: req.user._id,
      },
    },
  });
});

const getUserById = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: `${user.name} profile fetched successfully`,
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
    },
  });
});

export {getMe, getUserById};
