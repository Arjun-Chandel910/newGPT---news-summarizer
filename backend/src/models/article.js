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
    index: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

articleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Article", articleSchema);
