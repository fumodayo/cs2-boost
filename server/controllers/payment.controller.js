import Stripe from "stripe";
import Order from "../models/order.model.js";
import { ORDER_STATUS } from "../constants/index.js";

const stripe = Stripe(
  "sk_test_51P0b8qB9f2IfrCxWpkTVPGAni4q3sQMF54HS4LIeviTs1dANI0xByFL5dhAJ07hAXdi40Bdiqexg5bOoIG4U2dNf00VBj2zFEl"
);

export const paymentOrder = async (req, res, next) => {
  const { currency, game, price, type } = req.body;
  const { id } = req.user;

  try {
    const orderItem = {
      price_data: {
        currency: currency,
        product_data: {
          name: game,
          description: type,
        },
        unit_amount: price,
      },
      quantity: 1,
    };
    const customer = await stripe.customers.create({
      metadata: {
        userId: id,
        cart: JSON.stringify(orderItem),
      },
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [orderItem],
      mode: "payment",
      success_url: "http://localhost:5173/dashboard",
      cancel_url: "http://localhost:5173/",
    });

    // await Order.findByIdAndUpdate(
    //   _id,
    //   {
    //     $set: {
    //       status: ORDER_STATUS.IN_ACTIVE,
    //     },
    //   },
    //   { new: true }
    // );

    res.status(201).json({ url: session.url });
  } catch (error) {
    next(error);
  }
};
