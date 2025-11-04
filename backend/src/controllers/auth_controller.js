require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

// cookie options
const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge,
  path: "/",
});
// Register user
module.exports.registerUser = async (req, res) => {
  try {
    const { password, username, email } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });
    const access_token = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refresh_token = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("access_token", access_token, cookieOptions(15 * 60 * 1000)); // 15 min
    res.cookie(
      "refresh_token",
      refresh_token,
      cookieOptions(7 * 24 * 60 * 60 * 1000) // 7 days
    );
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      error: "Something went wrong!",
      message: err.message,
    });
  }
};
// Login user
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }
    const access_token = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refresh_token = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("access_token", access_token, cookieOptions(15 * 60 * 1000));
    res.cookie(
      "refresh_token",
      refresh_token,
      cookieOptions(7 * 24 * 60 * 60 * 1000)
    ); // 7 days
    res.status(200).json({
      message: "Logged in successfully!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      error: "Something went wrong!",
      message: err.message,
    });
  }
};
// Refresh access token
module.exports.refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided." });
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: "Invalid or expired refresh token.",
          });
        }
        const newAccessToken = jwt.sign(
          { id: decoded.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        res.cookie(
          "access_token",
          newAccessToken,
          cookieOptions(15 * 60 * 1000)
        );
        res.status(200).json({
          message: "Access token refreshed successfully.",
        });
      }
    );
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({
      error: "Something went wrong during token refresh.",
      message: err.message,
    });
  }
};
// Logout
module.exports.logout = async (req, res) => {
  try {
    const clearOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    };
    res.clearCookie("access_token", clearOptions);
    res.clearCookie("refresh_token", clearOptions);
    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({
      error: "Something went wrong!",
      message: err.message,
    });
  }
};
// Get current user
module.exports.getCurrentUser = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken) {
      return res.status(401).json({ message: "Not logged in." });
    }
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: "Invalid or expired token.",
          });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
      }
    );
  } catch (err) {
    console.error("GetCurrentUser error:", err);
    res.status(500).json({
      error: "Something went wrong!",
      message: err.message,
    });
  }
};
