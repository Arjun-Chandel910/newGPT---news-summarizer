const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username must be at most 20 characters"],
      match: [
        /^[a-zA-Z0-9_-]{3,20}$/,
        "Username can only contain letters, digits, underscore, and hyphen",
      ],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      maxlength: [254, "Email is too long"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [64, "Password must be at most 64 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      ],
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    providers: {
      google: {
        id: { type: String },
        accessToken: { type: String },
      },
      github: {
        id: { type: String },
        accessToken: { type: String },
      },
      linkedin: {
        id: { type: String },
        accessToken: { type: String },
      },
    },
    avatar: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
