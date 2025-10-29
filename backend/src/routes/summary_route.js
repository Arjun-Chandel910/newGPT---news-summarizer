const express = require("express");
const router = express.Router();
const {
  createSummary,
  getSummariesByUser,
  getSummaryById,
  updateSummary,
  deleteSummary,
} = require("../controllers/summary_controller.js");

// Create a new summary
router.post("/", createSummary);

//get all user summaries
router.get("/user/:userId", getSummariesByUser);

//get summary by id
router.get("/:id", getSummaryById);

//delete
router.delete("/:id", deleteSummary);

module.exports = router;
