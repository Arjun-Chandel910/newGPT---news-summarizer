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

// Pre-save middleware to store old username
userSchema.pre("save", function (next) {
  if (this.isModified("username")) {
    this._oldUsername = this.get("username", null, { getters: false });
  }
  next();
});

// Post-save middleware to update ownerName in articles and summaries
userSchema.post("save", async function (doc) {
  if (doc._oldUsername && doc._oldUsername !== doc.username) {
    try {
      const Article = mongoose.model("Article");
      const Summary = mongoose.model("Summary");

      // Update articles
      await Article.updateMany({ owner: doc._id }, { ownerName: doc.username });

      // Update summaries
      await Summary.updateMany({ user: doc._id }, { ownerName: doc.username });
    } catch (err) {
      console.error("Error updating ownerName:", err);
    }
  }
});

module.exports = mongoose.model("User", userSchema);
