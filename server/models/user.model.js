import mongoose from "mongoose";
import { ROLE } from "../constants/index.js";

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
        "https://lh3.googleusercontent.com/ogw/AF2bZyieFPjFR8czkbCUMbZMA7xvXviWzpPKBimyXYUnKQ=s32-c-mo",
    },
    user_id: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ROLE,
      default: ROLE.CLIENT,
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
