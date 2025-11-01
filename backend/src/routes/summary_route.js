const express = require("express");
const router = express.Router();
const {
  createSummary,
  getSummariesByUser,
  getSummaryById,

  deleteSummary,
} = require("../controllers/summary_controller.js");
const { requiredUser } = require("../middleware/auth_middleware.js");

router.post("/", requiredUser, createSummary);

router.get("/user/:userId", requiredUser, getSummariesByUser);

router.get("/:id", requiredUser, getSummaryById);

router.delete("/:id", requiredUser, deleteSummary);

module.exports = router;
