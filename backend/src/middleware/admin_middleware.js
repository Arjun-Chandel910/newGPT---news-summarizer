const jwt = require("jsonwebtoken");
const User = require("../models/user");
module.exports.requiredAdmin = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      return res.status(401).json({ message: "No access token." });
    }
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.id;
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access Denied!" });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      message: err.message || "Invalid or expired token.",
    });
  }
};
