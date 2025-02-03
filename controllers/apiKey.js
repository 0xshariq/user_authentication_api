import User from "../models/user.js"
import ErrorHandler from "../middleware/error.js"

export const validateApiKey = async (req, res, next) => {
  try {
    const { apiKey } = req.query

    if (!apiKey) {
      return next(new ErrorHandler(400, "API key is required"))
    }

    const user = await User.findOne({ "apiKey.key": apiKey })

    if (!user || !user.apiKey.active) {
      return res.status(403).json({
        valid: false,
        message: "Invalid or inactive API key",
      })
    }

    // Check if the user has exceeded their request limit
    if (user.apiKey.requestCount >= user.apiKey.requestLimit) {
      return res.status(429).json({
        valid: false,
        message: "API request limit exceeded",
      })
    }

    // Increment the request count
    user.apiKey.requestCount += 1
    await user.save()

    // Return success with user info (excluding sensitive data)
    res.status(200).json({
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
    })
  } catch (error) {
    console.error("Error validating API key:", error)
    next(new ErrorHandler(500, "Error validating API key"))
  }
}

