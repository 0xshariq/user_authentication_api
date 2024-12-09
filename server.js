import { config } from "dotenv";
import { app } from "./app.js";

import { connectDB } from "./db/database.js";

config({
  path: "./db/config.env",
});
connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
