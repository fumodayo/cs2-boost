import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import orderRouter from "./routes/order.route.js";
import accountRouter from "./routes/account.route.js";
import paymentRouter from "./routes/payment.route.js";
import cookieParser from "cookie-parser";

// import Stripe from "stripe";
// const stripe = Stripe(
//   "sk_test_51P0b8qB9f2IfrCxWpkTVPGAni4q3sQMF54HS4LIeviTs1dANI0xByFL5dhAJ07hAXdi40Bdiqexg5bOoIG4U2dNf00VBj2zFEl"
// );

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

// let endpointSecret =
//   "whsec_db651c562648733c76defec9527fa066fea95d2a55e5f6d2a9ccc47d0d216116";

// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   (request, response) => {
//     const sig = request.headers["stripe-signature"];

//     let data;
//     let eventType;

//     if (endpointSecret) {
//       let event;

//       try {
//         event = stripe.webhooks.constructEvent(
//           request.body,
//           sig,
//           endpointSecret
//         );
//         console.log("Webhook verified");
//       } catch (err) {
//         console.log(`Webhook Error: ${err.message}`);
//         response.status(400).send(`Webhook Error: ${err.message}`);
//         return;
//       }

//       data = event.data.object;
//       eventType = event.type;
//     } else {
//       data = req.body.data.object;
//       eventType = req.body.type;
//     }

//     console.log(eventType);
//     response.send();
//   }
// );

app.listen("3000", () => {
  console.log(`listening on ${3000}`);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/order", orderRouter);
app.use("/api/account", accountRouter);
app.use("/api/payment", paymentRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
