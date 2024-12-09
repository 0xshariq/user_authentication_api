import mongoose from "mongoose";
export const connectDB = () => {
  mongoose
    .connect(
      process.env.MONGO_URI
    )
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
