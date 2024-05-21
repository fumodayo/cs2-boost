import mongoose from "mongoose";
import { INCOME_STATUS } from "../constants/index.js";

const incomeSchema = new mongoose.Schema(
  {
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: INCOME_STATUS,
      default: INCOME_STATUS.DEPOSIT,
    },
  },
  {
    timestamps: true,
  }
);

const amountSchema = new mongoose.Schema(
  {
    amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ordersSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

const revenueSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    income: [incomeSchema],
    money_pending: [amountSchema],
    money_profit: [amountSchema],
    money_fine: [amountSchema],
    orders_pending: [ordersSchema],
    orders_completed: [ordersSchema],
    orders_cancel: [ordersSchema],
    total_order_pending: [amountSchema],
    total_order_completed: [amountSchema],
    total_order_cancel: [amountSchema],
    total_money_pending: { type: Number, default: 0 },
    total_money_profit: { type: Number, default: 0 },
    total_money_fine: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Revenue = mongoose.model("Revenue", revenueSchema);

export default Revenue;
