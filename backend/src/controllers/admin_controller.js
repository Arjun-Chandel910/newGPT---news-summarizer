const User = require("../models/user");
const Article = require("../models/article");
const Summary = require("../models/summary");

// Make user admin
exports.makeUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.isAdmin = true;
    await user.save();
    res.status(200).json({ message: "User promoted to admin successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to promote user", message: err.message });
  }
};

// stats
exports.getAdminStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments({});
    const articlesCount = await Article.countDocuments({});
    const summariesCount = await Summary.countDocuments({});
    res.status(200).json({ usersCount, articlesCount, summariesCount });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch stats", message: err.message });
  }
};

// All summaries
exports.getAllSummaries = async (req, res) => {
  try {
    const limit = Number(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const page = Number(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const sort = req.query.sort === "asc" ? 1 : -1;

    const total = await Summary.countDocuments({});
    const summaries = await Summary.find({})
      .sort({ createdAt: sort })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ summaries, total, page, limit });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch summaries", message: err.message });
  }
};

// All articles
exports.getAllArticles = async (req, res) => {
  try {
    const limit = Number(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const page = Number(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const sort = req.query.sort === "asc" ? 1 : -1;

    const total = await Article.countDocuments({});
    const articles = await Article.find({})
      .sort({ createdAt: sort })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ articles, total, page, limit });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch articles", message: err.message });
  }
};

// delete a summary
exports.deleteSummaryById = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: "Summary not found" });
    }
    await Summary.findByIdAndDelete(req.params.id);
    const summaryKeys = await redisClient.keys(`user:*:summaries:page:*`);
    for (const k of summaryKeys) {
      await redisClient.del(k);
    }

    res.status(200).json({ message: "Summary deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete summary", message: err.message });
  }
};

// delete an article
exports.deleteArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    await Article.findByIdAndDelete(req.params.id);
    const articleKeys = await redisClient.keys(`user:*:articles:page:*`);
    for (const k of articleKeys) {
      await redisClient.del(k);
    }

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete article", message: err.message });
  }
};
