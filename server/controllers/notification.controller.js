import Notification from "../models/notification.model.js";
import { ROLE, NOTIFICATION_TYPE } from "../constants/index.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let notifications;
    if (user.role.includes(ROLE.BOOSTER)) {
      notifications = await Notification.find({
        $or: [{ type: NOTIFICATION_TYPE.BOOST }, { receiver: userId }],
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "sender",
          select: "-password",
        });
    } else {
      notifications = await Notification.find({ receiver: userId })
        .sort({ createdAt: -1 })
        .populate({
          path: "sender",
          select: "-password",
        });
    }

    if (!notifications) {
      return res.status(200).json([]);
    }

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const readNotification = async (req, res, next) => {
  try {
    const { id } = req.user;
    console.log("user", id);

    await Notification.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isRead: true,
        },
      },
      { new: true }
    );

    const receiverSocketId = getReceiverSocketId(id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification");
    }

    res.status(201).json("notification read");
  } catch (error) {
    next(error);
  }
};
