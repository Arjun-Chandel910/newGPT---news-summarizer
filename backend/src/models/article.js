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
    required: true,
    index: true,
  },
  ownerName: {
    type: String,
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

articleSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  if (this.owner && !this.ownerName) {
    const User = mongoose.model("User");
    const user = await User.findById(this.owner);
    if (user) {
      this.ownerName = user.username;
    }
  }
  next();
});

module.exports = mongoose.model("Article", articleSchema);
