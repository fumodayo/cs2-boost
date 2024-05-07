import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res, next) => {
  try {
    const id = req.params.id;
    const notifications = await Notification.find({
      $or: [
        { receiver: id },
        { type: "boost" },
      ],
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "sender",
        select: "-password",
      });

    if (!notifications) return res.status(200).json([]);

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};
