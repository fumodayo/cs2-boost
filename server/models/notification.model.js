import mongoose from "mongoose";
import { NOTIFICATION_TYPE } from "../constants/index.js";

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    boost_id: {
      type: String,
    },
    content: {
      type: String,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPE,
      default: NOTIFICATION_TYPE.MESSAGE,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
