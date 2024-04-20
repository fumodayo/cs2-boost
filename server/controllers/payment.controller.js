import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

/*
 * CHECKOUT ORDER
 * 1. CREATE BILL PAYMENT BY STRIPE
 * 2. CHANGE ORDER STATUS: PENDING -> IN_ACTIVE
 */
export const paymentOrder = async (req, res, next) => {
  const { currency, game, price, type, _id } = req.body;
  const { id } = req.user;

  try {
    const orderItem = {
      price_data: {
        currency: currency,
        product_data: {
          name: game,
          description: type,
        },
        unit_amount: currency === "usd" ? price * 100 : price,
      },
      quantity: 1,
    };
    const customer = await stripe.customers.create({
      metadata: {
        user_id: id,
        order_id: _id,
      },
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [orderItem],
      mode: "payment",
      success_url: "http://localhost:5173/dashboard",
      cancel_url: "http://localhost:5173/",
    });

    res.status(201).json({ url: session.url });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
