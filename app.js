import express from "express";
import userRouter from "./routes/user.js";
import apiKeyRouter from "./routes/apiKey.js";
export const app = express();


// Middleware
app.use(express.json()); // This will parse the incoming request body to json
app.use("/api/v2/users", userRouter);
app.use("/api/v2/apiKey", apiKeyRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL_1,process.env.FRONTEND_URL_2,"http://localhost:5000","http://localhost:8000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World");
});
