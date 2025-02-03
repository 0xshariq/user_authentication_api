import express from "express";
import userRouter from "./routes/user.js";

export const app = express();


// Middleware
app.use(express.json()); // This will parse the incoming request body to json
app.use("/api/v2/users", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});
