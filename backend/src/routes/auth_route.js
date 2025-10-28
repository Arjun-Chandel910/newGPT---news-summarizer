const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  refreshAccessToken,
  getCurrentUser,
  logout,
} = require("../controllers/auth_controller.js");
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.get("/me", getCurrentUser);
module.exports = router;
