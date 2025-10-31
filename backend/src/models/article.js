const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 140,
  },
  body: {
    type: String,
    required: true,
    maxlength: 10000,
  },
  source: {
    type: String,
    trim: true,
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "private",
    index: true, // Supports fast filtering
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Fast filtering by user
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // For sorting and profile views
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
});

articleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Article", articleSchema);
