const Summary = require("../models/summary.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");
require("dotenv").config();
const { InferenceClient } = require("@huggingface/inference");
const redisClient = require("../../redisClient.js");

// Validate user helper
async function getValidatedUser(req, res) {
  if (!req.userId) {
    res.status(401).json({ error: "User not authenticated." });
    return null;
  }
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return null;
  }
  return user;
}

// Create summary
exports.createSummary = async (req, res) => {
  try {
    const user = await getValidatedUser(req, res);
    if (!user) return;
    const { originalText } = req.body;
    if (!originalText) {
      return res.status(400).json({ error: "Text is required." });
    }
    let summaryText;
    if (process.env.NODE_ENV === "test") {
      // Mock summary for tests
      summaryText = `Mock summary for: ${originalText}`;
    } else {
      const client = new InferenceClient(process.env.HF_TOKEN);
      const summaryOutput = await client.summarization({
        model: "facebook/bart-large-cnn",
        inputs: originalText,
      });
      summaryText = summaryOutput.summary_text;
    }
    const summary = await Summary.create({
      originalText,
      summaryText,
      user: req.userId,
    });

    // delete all redis keys w.r.t. pagination
    const keys = await redisClient.keys(`user:${req.userId}:summaries:page:*`);
    for (const k of keys) {
      await redisClient.del(k);
    }

    res.status(201).json({
      message: "Summary created successfully",
      summary,
    });
    console.log("summary");
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create summary", message: err.message });
  }
};

// Get all summaries
exports.getAllSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find();
    res.status(200).json({ summaries });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get summaries", message: err.message });
  }
};

// Get summaries by user
exports.getSummariesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = Number(req.query.limit) > 0 ? parseInt(req.query.limit) : 5;
    const page = Number(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const sort = req.query.sort === "asc" ? 1 : -1;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Compose cache key for this user's paginated view
    const cacheKey = `user:${userId}:summaries:page:${page}:limit:${limit}:sort:${sort}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const total = await Summary.countDocuments({ user: userObjectId });
    const summaries = await Summary.find({ user: userObjectId })
      .sort({ createdAt: sort })
      .skip((page - 1) * limit)
      .limit(limit);

    const response = { summaries, total, page, limit };
    await redisClient.setEx(cacheKey, 600, JSON.stringify(response));
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      error: "Failed to get summaries for user",
      message: err.message,
    });
  }
};

// Get single summary by ID
exports.getSummaryById = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: "Summary not found" });
    }
    res.status(200).json({ summary });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get summary", message: err.message });
  }
};

// Delete summary
exports.deleteSummary = async (req, res) => {
  try {
    const user = await getValidatedUser(req, res);
    if (!user) return;
    const summary = await Summary.findById(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: "Summary not found" });
    }
    if (summary.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized: Not your summary." });
    }
    await Summary.findByIdAndDelete(req.params.id);

    // delete all redis keys w.r.t. pagination

    const keys = await redisClient.keys(`user:${req.userId}:summaries:page:*`);
    for (const k of keys) {
      await redisClient.del(k);
    }

    res.status(200).json({ message: "Summary deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete summary", message: err.message });
  }
};
