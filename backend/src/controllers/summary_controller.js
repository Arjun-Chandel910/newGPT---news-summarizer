const Summary = require("../models/summary.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");
require("dotenv").config();
const { InferenceClient } = require("@huggingface/inference");
const redisClient = require("../../redisClient.js");

async function validateUser(req, res) {
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
    const user = await validateUser(req, res);
    if (!user) return;

    const { originalText } = req.body;
    if (!originalText) {
      return res.status(400).json({ error: "Text is required." });
    }

    let summaryText;
    if (process.env.NODE_ENV === "test") {
      summaryText = `Mock summary for: ${originalText}`;
    } else if (process.env.HF_TOKEN) {
      const client = new InferenceClient(process.env.HF_TOKEN);
      const summaryOutput = await client.summarization({
        model: "facebook/bart-large-cnn",
        inputs: originalText,
      });
      summaryText = summaryOutput.summary_text;
    } else {
      summaryText = `Mock summary for: ${originalText}`;
    }

    const summary = await Summary.create({
      originalText,
      summaryText,
      user: req.userId,
    });

    try {
      const keys = await redisClient.keys(
        `user:${req.userId}:summaries:page:*`
      );
      for (const k of keys) {
        await redisClient.del(k);
      }
    } catch (redisErr) {
      console.warn("Redis operation failed:", redisErr.message);
    }

    res.status(201).json({
      message: "Summary created successfully",
      summary,
    });
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

    let summaries, total;

    try {
      const cacheKey = `user:${userId}:summaries:page:${page}:limit:${limit}:sort:${sort}`;
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log("cached");
        return res.status(200).json(JSON.parse(cached));
      }

      total = await Summary.countDocuments({ ownerName: user.username });
      summaries = await Summary.find({ ownerName: user.username })
        .sort({ createdAt: sort })
        .skip((page - 1) * limit)
        .limit(limit);

      const response = { summaries, total, page, limit };
      await redisClient.setEx(cacheKey, 600, JSON.stringify(response));
    } catch (redisErr) {
      console.warn(
        "Redis operation failed, fetching from database:",
        redisErr.message
      );
      total = await Summary.countDocuments({ ownerName: user.username });
      summaries = await Summary.find({ ownerName: user.username })
        .sort({ createdAt: sort })
        .skip((page - 1) * limit)
        .limit(limit);
    }

    const response = { summaries, total, page, limit };
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
    const user = await validateUser(req, res);
    if (!user) return;

    const summary = await Summary.findById(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: "Summary not found" });
    }

    if (summary.ownerName !== user.username) {
      return res.status(403).json({ error: "Unauthorized: Not your summary." });
    }

    await Summary.findByIdAndDelete(req.params.id);

    try {
      const keys = await redisClient.keys(
        `user:${req.userId}:summaries:page:*`
      );
      for (const k of keys) {
        await redisClient.del(k);
      }
    } catch (redisErr) {
      console.warn("Redis operation failed:", redisErr.message);
    }

    res.status(200).json({ message: "Summary deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete summary", message: err.message });
  }
};
