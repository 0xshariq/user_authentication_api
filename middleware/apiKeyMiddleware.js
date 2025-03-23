import User from "../models/user.js";
import ErrorHandler from "./error.js";

const validateApiKeyMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"] || req.body.apiKey; // ✅ Check both headers and body

    if (!apiKey) {
      return res.status(400).json({ valid: false, message: "API key is required" });
    }

    const user = await User.findOne({ "apiKey.key": apiKey });

    if (!user || !user.apiKey.active) {
      return res.status(403).json({ valid: false, message: "Invalid or inactive API key" });
    }

    // ✅ Prevents unlimited API usage
    if (user.apiKey.requestCount >= user.apiKey.requestLimit) {
      return res.status(429).json({ valid: false, message: "API request limit exceeded" });
    }

    // ✅ Increment request count
    user.apiKey.requestCount += 1;
    await user.save();

    // ✅ Attach user info to `req.user`
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    next(); // Move to next middleware or route
  } catch (error) {
    console.error("Error validating API key:", error);
    return res.status(500).json({ valid: false, message: "Error validating API key" });
  }
};

export default validateApiKeyMiddleware;
