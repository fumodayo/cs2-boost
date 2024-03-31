import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import orderRouter from "./routes/order.route.js";
import accountRouter from "./routes/account.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error(err));

export const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen("3000", () => {
  console.log(`listening on ${3000}`);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/order", orderRouter);
app.use("/api/account", accountRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
