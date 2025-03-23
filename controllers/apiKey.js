import User from "../models/user.js";

export const validateApiKey = async (req, res, next) => {
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

    return res.status(200).json({
      valid: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        apiKey: {
          requestCount: user.apiKey.requestCount,
          requestLimit: user.apiKey.requestLimit,
        },
      },
    });
  } catch (error) {
    console.error("Error validating API key:", error);
    return res.status(500).json({ valid: false, message: "Error validating API key" });
  }
};
