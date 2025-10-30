const jwt = require("jsonwebtoken");
module.exports.requiredUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      return res.status(401).json({ message: "No access token." });
    }
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json({
      message: err.message || "Invalid or expired token.",
    });
  }
};
