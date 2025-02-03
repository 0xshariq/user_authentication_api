import { config } from "dotenv";
import { connectDB } from "./db/database.js";
import {app} from "./app.js";


config({
  path: "config.env",
});
connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
