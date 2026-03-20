const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const isTokenBlacklisted = await blacklistModel.findOne({ token });

    if (isTokenBlacklisted) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
