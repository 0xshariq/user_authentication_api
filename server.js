// Import required dependencies
import express from "express"; // Express framework for building APIs
import dotenv from "dotenv"; // Loads environment variables from .env file
import cors from "cors"; // Enables Cross-Origin Resource Sharing (CORS)
import cookieParser from "cookie-parser"; // Parses cookies from incoming requests
import helmet from "helmet"; // Sets security-related HTTP headers
import rateLimit from "express-rate-limit"; // Limits repeated requests to the API
import mongoSanitize from "express-mongo-sanitize"; // Prevents NoSQL injection attacks
import compression from "compression"; // Enables gzip compression for improved performance
import morgan from "morgan"; // Logs HTTP requests for debugging and monitoring
import createDOMPurify from "dompurify"; // Sanitizes user inputs to prevent XSS attacks
import { JSDOM } from "jsdom"; // Provides a virtual DOM for DOMPurify to work
import { createClient } from "redis"; // Redis client for caching and rate limiting
import { connectDB } from "./db/database.js"; // Connects to MongoDB database
import userRouter from "./routes/user.js"; // User-related API routes
import apiKeyRouter from "./routes/apiKey.js"; // API Key management routes

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

// Initialize Express application
const app = express();

// Initialize Redis client for caching and rate limiting
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Setup DOMPurify for input sanitization (prevents XSS attacks)
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
const sanitizeInput = (input) => DOMPurify.sanitize(input);

// Middleware setup
app.use(express.json()); // Parses JSON payloads from requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(cookieParser()); // Enables cookie handling
app.use(helmet()); // Protects API by setting various HTTP security headers
app.use(mongoSanitize()); // Sanitizes incoming requests to prevent NoSQL injection
app.use(compression()); // Compresses response bodies for better performance
app.use(morgan("dev")); // Logs incoming requests (useful for debugging)

// CORS Configuration - Allows requests from specific front-end origins
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL_1,
      process.env.FRONTEND_URL_2,
      "http://localhost:5000",
      "http://localhost:8000",
      "https://user-authentication-api-jqfm.onrender.com",
    ],
    credentials: true, // Allows credentials like cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  })
);

// Rate Limiting - Prevents API abuse by limiting requests from the same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Time window: 15 minutes
  max: 100, // Max 100 requests per IP per window
  message: "Too many requests from this IP, please try again later.", // Error message for rate limiting
});

app.use(limiter); // Apply rate limiting to all API routes

// Sanitize input data before storing or processing (XSS protection)
app.use((req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      req.body[key] = sanitizeInput(req.body[key]);
    }
  }
  next();
});

// Define API Routes
app.use("/api/v2/users", userRouter); // User management routes
app.use("/api/v2/apiKey", apiKeyRouter); // API key management routes

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Graceful Shutdown - Closes Redis connection when server stops
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await redisClient.quit(); // Close Redis connection
  process.exit(0);
});
