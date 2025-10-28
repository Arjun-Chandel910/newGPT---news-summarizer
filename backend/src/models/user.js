const mongoose = require("mongoose");
const Article = require("./article.js");
const Summary = require("./summary.js");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.post("deleteMany", async function (doc) {
  if (doc) {
    await Article.deleteMany({ owner: doc._id });
    await Summary.deleteMany({ user: doc._id });
  }
});

module.exports = mongoose.model("User", userSchema);
