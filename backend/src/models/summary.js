const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  originalText: {
    type: String,
    required: true,
  },
  summaryText: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  ownerName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

summarySchema.pre("save", async function (next) {
  if (this.user && !this.ownerName) {
    const User = mongoose.model("User");
    const user = await User.findById(this.user);
    if (user) {
      this.ownerName = user.username;
    }
  }
  next();
});

module.exports = mongoose.model("Summary", summarySchema);
