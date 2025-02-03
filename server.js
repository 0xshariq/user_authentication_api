import { config } from "dotenv";
import { app } from "./app.js";

import { connectDB } from "./db/database.js";

config({
  path: "config.env",
});
connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
