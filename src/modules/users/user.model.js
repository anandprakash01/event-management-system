import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, "Name should have at least 2 characters"],
    maxLength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minLength: [5, "Email is too short!"],
    maxLength: [255, "Email is too long!"],
  },

  role: {
    type: String,
    enum: {
      values: ["admin", "user"],
      message: "{VALUE} is not a valid role in this system.",
    },
    default: "user",
  },
  age: {
    type: Number,
    required: true,
    min: [16, "Minimum required age is 16!"],
    max: [65, "We don't allow old peoples✋"],
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password should have at least 6 characters"],
    select: false,
  },
  accountLockedUntil: {
    type: Date,
    select: false,
  },
  failedLoginAttempts: {
    type: Number,
    select: false,
    default: 0,
  },
});

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

export default User;
