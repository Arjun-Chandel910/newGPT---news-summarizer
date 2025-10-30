const Article = require("../models/article.js");
const User = require("../models/user.js");

// Helper: Check if current user exists
async function requireExistingUser(req, res) {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(401).json({ error: "User not found or not authorized." });
    return false;
  }
  return true;
}

// Create a new article
exports.createArticle = async (req, res) => {
  try {
    if (!(await requireExistingUser(req, res))) return;
    const { title, text, source } = req.body;
    if (!title || !text) {
      return res.status(400).json({ error: "Title and text are required." });
    }
    const article = await Article.create({
      title,
      text,
      source,
      owner: req.userId,
    });
    res.status(201).json({ message: "Article created successfully", article });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create article", message: err.message });
  }
};

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json({ articles });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get articles", message: err.message });
  }
};

// Get single article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json({ article });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get article", message: err.message });
  }
};

// Update an article by ID
exports.updateArticle = async (req, res) => {
  try {
    if (!(await requireExistingUser(req, res))) return;
    const { title, text, source } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    if (article.owner.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized: Not your article." });
    }
    article.title = title ?? article.title;
    article.text = text ?? article.text;
    article.source = source ?? article.source;
    await article.save();
    res.status(200).json({ message: "Article updated", article });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update article", message: err.message });
  }
};

// Delete an article by ID
exports.deleteArticle = async (req, res) => {
  try {
    if (!(await requireExistingUser(req, res))) return;
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    if (article.owner.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized: Not your article." });
    }
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Article deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete article", message: err.message });
  }
};
