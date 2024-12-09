// mongodb+srv://khanshariq92213:Login7422@cluster0.hpaqd.mongodb.net/api?retryWrites=true&w=majority
import express from "express";
import mongoose from "mongoose";

const app = express();

// Middleware
app.use(express.json());  // This will parse the incoming request body to json

mongoose
  .connect(
    "mongodb+srv://khanshariq92213:Login7422@cluster0.hpaqd.mongodb.net/api?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/users/all", async (req, res) => {
  const users = await User.find({});
  res.json({
    success: true,
    users,
  });
});

app.post("/users/new", async (req, res) => {
  const { name, email, password } = req.body;

  await User.create({
    name,
    email,
    password,
  });
  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
});

app.get("/userid/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({
    success: true,
    user,
  });
})

app.listen(8000, () => {
  console.log("Server is running");
});
