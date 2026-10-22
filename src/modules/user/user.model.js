import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
      minLength: [3, "Name should have min 3 character"],
      maxLength: [50, "Name cannot be more than 50 character"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      min: [8, "Email is too short!"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "architect"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    accountLockedUntil: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export {User};
