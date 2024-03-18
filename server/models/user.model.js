import mongoose from "mongoose";

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
      default:
        "https://lh3.googleusercontent.com/ogw/AF2bZyieFPjFR8czkbCUMbZMA7xvXviWzpPKBimyXYUnKQ=s32-c-mo",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
