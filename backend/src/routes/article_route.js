const express = require("express");
const router = express.Router();
const {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require("../controllers/article_controller.js");
const { requiredUser } = require("../middleware/auth_middleware.js");

router.post("/", requiredUser, createArticle);

router.get("/", requiredUser, getAllArticles);

router.get("/:id", getArticleById);

router.put("/:id", requiredUser, updateArticle);

router.delete("/:id", requiredUser, deleteArticle);

module.exports = router;
