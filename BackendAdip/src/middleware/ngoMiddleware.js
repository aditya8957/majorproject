const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const ngoMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      throw new Error("Token is not present");
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);
    const { _id } = payload;

    if (!_id) {
      throw new Error("Invalid token");
    }

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User Doesn't Exist");
    }

    if (user.role !== "ngo" || !user.isNgoApproved) {
      return res.status(403).json({ success: false, message: "NGO approval required" });
    }

    // Redis check for token blacklist
    const IsBlocked = await redisClient.exists(`token:${token}`);

    if (IsBlocked) {
      throw new Error("Invalid Token");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Error: " + err.message
    });
  }
};

module.exports = ngoMiddleware;
