import mongoose from "mongoose";
import { IP_STATUS, ROLE } from "../constants/index.js";

const IPLoggerSchema = new mongoose.Schema(
  {
    country: String,
    city: String,
    ip: String,
    status: {
      type: String,
      enum: IP_STATUS,
      default: IP_STATUS.ONLINE,
    },
  },
  { timestamps: true }
);

const SocialMediaSchema = new mongoose.Schema({
  type: { type: String, required: true },
  username: String,
  code: String,
  link: String,
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_picture: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/du93troxt/image/upload/v1714744499/avatar_qyersf.jpg",
    },
    user_id: { type: String, required: true, unique: true },
    role: {
      type: [String],
      enum: ROLE,
      default: [ROLE.CLIENT],
    },
    is_verified: {
      type: Boolean,
      required: true,
      default: false,
    },

    //VERIFICATION
    addresses: {
      type: String,
    },
    cccd_number: {
      type: String,
    },
    cccd_issue_date: {
      type: Date,
    },
    date_of_birth: {
      type: Date,
    },
    gender: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    real_name: {
      type: String,
    },
    ip_logger: [IPLoggerSchema],
    social_media: [SocialMediaSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
