import mongoose from "mongoose";
import { z } from "zod";

// Define Zod schema for validation
const userValidationSchema = z.object({
  name: z.string().min(2).max(50), // Ensures name is between 2 and 50 characters
  email: z.string().email().trim().toLowerCase().regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g), // Validates email format
  password: z.string().min(6).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm), // Ensures password is at least 6 characters
  apiKey: z
    .object({
      key: z.string(), 
      requestCount: z.number().default(0), // Defaults to 0
      requestLimit: z.number().default(1000), // Default limit
      active: z.boolean().default(true), // API key status
    })
});

// Define Mongoose schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, 
    },
    apiKey: {
      key: {
        type: String,
        unique: true,
        sparse: true,
      },
      requestCount: {
        type: Number,
        default: 0,
      },
      requestLimit: {
        type: Number,
        default: 1000,
      },
      active: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

// Apply Zod validation before saving to the database
UserSchema.pre("save", function (next) {
  try {
    userValidationSchema.parse(this.toObject()); // Validate the document
    next();
  } catch (error) {
    next(error);
  }
});

// Create User model
const User = mongoose.model("User", UserSchema);

export default User;
