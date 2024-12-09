import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

export const User = new mongoose.model("User", userSchema);
