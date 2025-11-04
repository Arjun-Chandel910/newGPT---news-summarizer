const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
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
