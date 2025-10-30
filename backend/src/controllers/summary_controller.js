const Summary = require("../models/summary.js");
const User = require("../models/user.js");
require("dotenv").config();
const { InferenceClient } = require("@huggingface/inference");

// Create summary
exports.createSummary = async (req, res) => {
  try {
    const { originalText, user } = req.body;
    if (!originalText || !user) {
      return res.status(400).json({ error: "text and user are required." });
    }
    const client = new InferenceClient(process.env.HF_TOKEN);
    const summaryOutput = await client.summarization({
      model: "facebook/bart-large-cnn",
      inputs: originalText,
      provider: "hf-inference",
    });
    const summary = await Summary.create({
      originalText: originalText,
      summaryText: summaryOutput.summary_text,
      user,
    });
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
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "Invalid User" });
    }
    const summaries = await Summary.find({ user: req.params.userId });
    res.status(200).json({ summaries });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get summaries", message: err.message });
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

// Delete
exports.deleteSummary = async (req, res) => {
  try {
    const summary = await Summary.findByIdAndDelete(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: "Summary not found" });
    }
    res.status(200).json({ message: "Summary deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete summary", message: err.message });
  }
};
