const express = require("express");
const router = express.Router();
const {
  createSummary,
  getSummariesByUser,
  getSummaryById,

  deleteSummary,
} = require("../controllers/summary_controller.js");

router.post("/", createSummary);

router.get("/user/:userId", getSummariesByUser);

router.get("/:id", getSummaryById);

router.delete("/:id", deleteSummary);

module.exports = router;
