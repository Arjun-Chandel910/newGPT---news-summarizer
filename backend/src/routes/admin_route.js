const express = require("express");
const router = express.Router();
const { requiredAdmin } = require("../middleware/admin_middleware.js");
const {
  getAdminStats,
  getAllSummaries,
  getAllArticles,
  deleteSummaryById,
  deleteArticleById,
} = require("../controllers/admin_controller.js");

router.get("/stats", requiredAdmin, getAdminStats);

router.get("/summaries", requiredAdmin, getAllSummaries);

router.get("/articles", requiredAdmin, getAllArticles);
router.delete("/summary/:id", requiredAdmin, deleteSummaryById);
router.delete("/article/:id", requiredAdmin, deleteArticleById);

module.exports = router;
