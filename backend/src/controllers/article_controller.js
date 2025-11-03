const Article = require("../models/article.js");
const User = require("../models/user.js");

//
const redisClient = require("../../redisClient.js");

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
    const { title, body, source, visibility } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required." });
    }
    const article = await Article.create({
      title,
      body,
      source,
      visibility: visibility || "private",
      owner: req.userId,
    });
    // delete all redis keys w.r.t. pagination
    const keys = await redisClient.keys(`user:${req.userId}:articles:page:*`);
    for (const k of keys) {
      await redisClient.del(k);
    }

    res.status(201).json({ message: "Article created successfully", article });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create article", message: err.message });
  }
};

exports.getArticlesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === "asc" ? 1 : -1;
    //  redis key for pagination
    const cacheKey = `user:${userId}:articles:page:${page}:limit:${limit}:sort:${sort}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return res.status(200).json(parsed);
    }
    const total = await Article.countDocuments({ owner: userId });
    const articles = await Article.find({ owner: userId })
      .sort({ createdAt: sort })
      .skip((page - 1) * limit)
      .limit(limit);

    const response = { articles, total, page, limit };
    await redisClient.setEx(cacheKey, 600, JSON.stringify(response));

    res.status(200).json(response);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get articles for user", message: err.message });
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

// Get single article by Id
exports.getArticleById = async (req, res) => {
  try {
    const id = req.params.id;

    // checks cache first
    const cached = await redisClient.get(`article:${id}`);
    if (cached) {
      return res
        .status(200)
        .json({ article: JSON.parse(cached), cached: true });
    }
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    await redisClient.setEx(`article:${id}`, 600, JSON.stringify(article));

    return res.status(200).json({ article });
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
    const { title, body, source, visibility } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    if (article.owner.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized: Not your article." });
    }
    article.title = title ?? article.title;
    article.body = body ?? article.body;
    article.source = source ?? article.source;
    article.visibility = visibility ?? article.visibility;
    await article.save();

    //delete all redis keys w.r.t pagination
    const keys = await redisClient.keys(`user:${req.userId}:articles:page:*`);
    for (const k of keys) {
      await redisClient.del(k);
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
    if (!(await requireExistingUser(req, res))) return;
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    if (article.owner.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized: Not your article." });
    }
    await Article.findByIdAndDelete(req.params.id);
    //delete all redis keys w.r.t pagination
    const keys = await redisClient.keys(`user:${req.userId}:articles:page:*`);
    for (const k of keys) {
      await redisClient.del(k);
    }

    res.status(200).json({ message: "Article deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete article", message: err.message });
  }
};
