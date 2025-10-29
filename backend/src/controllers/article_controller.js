const Article = require("../models/article.js");

// Create a new article
exports.createArticle = async (req, res) => {
  try {
    const { title, text, source, owner } = req.body; // owner passed from body

    if (!title || !text || !owner) {
      return res
        .status(400)
        .json({ error: "Title, text, and owner are required." });
    }

    const article = await Article.create({ title, text, source, owner });
    res.status(201).json({ message: "Article created successfully", article });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create article", message: err.message });
  }
};

// Get all articles (no filtering by owner)
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
    const { title, text, source } = req.body;
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { title, text, source },
      { new: true }
    );
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
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
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete article", message: err.message });
  }
};
