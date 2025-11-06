const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./src/routes/auth_route.js");
const articleRoutes = require("./src/routes/article_route.js");
const summaryRoutes = require("./src/routes/summary_route.js");
const adminRoutes = require("./src/routes/admin_route.js");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(
  cors({
    origin:
      "https://newgpt-news-summarizer-git-main-arjun-chandel910s-projects.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/admin", adminRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app;
