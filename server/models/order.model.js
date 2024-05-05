import mongoose from "mongoose";
import { ORDER_STATUS } from "../constants/index.js";

const orderSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/du93troxt/image/upload/v1714743928/cs2_agyroj.png",
    },
    boost_id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    game: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    options: { type: Array, required: true, default: [] },
    status: { type: String, required: true, default: "pending" },
    server: { type: String, required: true },
    start_exp: { type: Number },
    end_exp: { type: Number },
    start_rating: { type: Number },
    end_rating: { type: Number },
    start_rank: { type: String },
    end_rank: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    booster: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    status: {
      type: String,
      enum: ORDER_STATUS,
      default: ORDER_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
