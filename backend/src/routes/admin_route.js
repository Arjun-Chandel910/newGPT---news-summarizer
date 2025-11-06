const express = require("express");
const router = express.Router();
const { requiredAdmin } = require("../middleware/admin_middleware.js");
const {
  getAdminStats,
  getAllSummaries,
  getAllArticles,
  deleteSummaryById,
  deleteArticleById,
  makeUserAdmin,
} = require("../controllers/admin_controller.js");

// Public route to make first user admin (for setup)
router.post("/make-admin/:userId", makeUserAdmin);

router.get("/stats", requiredAdmin, getAdminStats);

router.get("/summaries", requiredAdmin, getAllSummaries);

router.get("/articles", requiredAdmin, getAllArticles);
router.delete("/summary/:id", requiredAdmin, deleteSummaryById);
router.delete("/article/:id", requiredAdmin, deleteArticleById);

module.exports = router;
