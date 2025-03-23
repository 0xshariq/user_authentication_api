import User from "../models/user.js";
import ErrorHandler from "./error.js";

const validateApiKeyMiddleware = async (req, res, next) => {
  try {
    // Retrieve API key from headers, body, or query parameters
    const apiKey = req.headers["x-api-key"] || req.body.apiKey || req.query.apiKey;

    if (!apiKey) {
      return next(new ErrorHandler(400, "API key is required"));
    }

    // Find user with the provided API key
    const user = await User.findOne({ "apiKey.key": apiKey });

    if (!user || !user.apiKey || !user.apiKey.active) {
      return next(new ErrorHandler(403, "Invalid or inactive API key"));
    }

    // Ensure requestCount and requestLimit exist
    if (
      typeof user.apiKey.requestCount !== "number" ||
      typeof user.apiKey.requestLimit !== "number"
    ) {
      return next(new ErrorHandler(500, "API key configuration error"));
    }

    // Check if request limit is exceeded
    if (user.apiKey.requestCount >= user.apiKey.requestLimit) {
      return next(new ErrorHandler(429, "API request limit exceeded"));
    }

    // Increment request count and update database
    user.apiKey.requestCount += 1;
    await user.save();

    // Attach user info to request object
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Error validating API key:", error);
    next(new ErrorHandler(500, "Error validating API key"));
  }
};

export default validateApiKeyMiddleware;
