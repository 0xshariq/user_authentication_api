import bcrypt from "bcryptjs";
import User from "../models/user.js";
import ErrorHandler from "../middleware/error.js";
import { sendCookie } from "../utils/sendCookie.js";
import generateApiKey from "../utils/generateApiKey.js";
import { sendApiKeyEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler(400, "All fields are required"));
    }

    let user = await User.findOne({ email });
    if (user) {
      return next(new ErrorHandler(400, "User already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Generate API key
    const apiKeyString = generateApiKey();

    // Create user with API key
    user = await User.create({
      name,
      email,
      password: hashPassword,
      apiKey: {
        key: apiKeyString,
        requestCount: 0,
        requestLimit: 1000,
        active: true,
      },
    });

    // Send API key email
    try {
      await sendApiKeyEmail(user._id, apiKeyString);
    } catch (emailError) {
      console.error("⚠️ Error sending API key email:", emailError.message);
    }

    sendCookie(user, res, "User registered successfully", 201);
  } catch (error) {
    console.error("❌ Registration error:", error);
    next(new ErrorHandler(500, "Error during registration"));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler(400, "Email and password are required"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler(401, "Invalid email or password"));
    }

    // Send API key email on login as well
    try {
      await sendApiKeyEmail(user._id, user.apiKey.key);
    } catch (emailError) {
      console.error("⚠️ Error sending API key email:", emailError.message);
    }

    sendCookie(user, res, "Login successful", 200);
  } catch (error) {
    console.error("❌ Login error:", error);
    next(new ErrorHandler(500, "Internal server error during login"));
  }
};

export const logout = async (req, res, next) => {
  try {
    res
      .clearCookie("token", {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logout successful",
      });
  } catch (error) {
    console.error("❌ Logout error:", error);
    next(new ErrorHandler(500, "Error during logout"));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Fetching users error:", error);
    next(new ErrorHandler(500, "Error fetching users"));
  }
};
