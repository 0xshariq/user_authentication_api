import User from "../models/user.js"
import ErrorHandler from "./error.js"

const validateApiKeyMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"] || req.body.apiKey

    if (!apiKey) {
      return next(new ErrorHandler(400, "API key is required"))
    }

    const user = await User.findOne({ "apiKey.key": apiKey })

    if (!user || !user.apiKey.active) {
      return next(new ErrorHandler(403, "Invalid or inactive API key"))
    }

    // Check if the user has exceeded their request limit
    if (user.apiKey.requestCount >= user.apiKey.requestLimit) {
      return next(new ErrorHandler(429, "API request limit exceeded"))
    }

    // Increment the request count
    user.apiKey.requestCount += 1
    await user.save()

    // Attach user info to the request object for further use
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    }

    next()
  } catch (error) {
    console.error("Error validating API key:", error)
    next(new ErrorHandler(500, "Error validating API key"))
  }
}

export default validateApiKeyMiddleware