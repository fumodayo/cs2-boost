import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import uploadRouter from "./routes/upload.route.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import orderRouter from "./routes/order.route.js";
import accountRouter from "./routes/account.route.js";
import paymentRouter from "./routes/payment.route.js";
import messageRouter from "./routes/message.route.js";
import walletRouter from "./routes/wallet.route.js";
import notificationRouter from "./routes/notification.route.js";
import cookieParser from "cookie-parser";
import Order from "./models/order.model.js";
import Invoice from "./models/invoice.model.js";
import revenueRouter from "./routes/revenue.route.js";
import { NOTIFICATION_TYPE, ORDER_STATUS } from "./constants/index.js";

import Stripe from "stripe";

import { app, io, server } from "./socket/socket.js";
import connectToMongoDB from "./database/connectToMogoDB.js";
import Notification from "./models/notification.model.js";

const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

dotenv.config();

connectToMongoDB();

let endpointSecret = process.env.ENDPOINT_SECRET_KEY;
/**
 * IF CHECKOUT COMPLETED
 * 1. FIND ORDER_ID INTO EVENT CHECKOUT
 * 2. CHANGE STATUS ORDER: PROCESS -> IN_ACTIVE
 * 3. CREATE NEW INVOICE
 */
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret
        );
      } catch (error) {
        response.status(400).send(`Webhook Error: ${error}`);
        return;
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          const orderId = customer.metadata.order_id;
          const newOrder = await Order.findByIdAndUpdate(
            orderId,
            {
              $set: {
                status: ORDER_STATUS.IN_ACTIVE,
              },
            },
            { new: true }
          );

          await Invoice.create({
            boost_id: newOrder.boost_id,
            title: newOrder.title,
            game: newOrder.game,
            type: newOrder.type,
            price: newOrder.price,
            currency: newOrder.currency,
            options: newOrder.options,
            server: newOrder.server,
            start_exp: newOrder.start_exp,
            end_exp: newOrder.end_exp,
            start_rating: newOrder.start_rating,
            end_rating: newOrder.end_rating,
            start_rank: newOrder.start_rank,
            end_rank: newOrder.end_rank,
            user: newOrder.user,
            account: newOrder.account,
            status: newOrder.status,
          });

          let existingNotification = await Notification.findOne({
            type: NOTIFICATION_TYPE.BOOST,
          });

          if (existingNotification) {
            await existingNotification.deleteOne();
          }

          const newNotification = new Notification({
            boost_id: newOrder.boost_id,
            content: "New Boost Created!",
            type: NOTIFICATION_TYPE.BOOST,
          });

          await newNotification.save();
          io.in("boosters").emit("newNotification");
        })
        .catch((error) => console.log(error.message));
    }

    response.send().end();
  }
);

app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());

app.use("/api/upload", uploadRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/order", orderRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/account", accountRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/messages", messageRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/revenue", revenueRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

server.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
