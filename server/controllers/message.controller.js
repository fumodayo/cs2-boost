import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/notification.model.js";
import { NOTIFICATION_TYPE } from "../constants/index.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { message, boost_id } = req.body;
    const { id: conversationId } = req.params;
    const senderId = req.user.id;

    let conversation = await Conversation.findById(conversationId);

    const receiverId = conversation.participants.find(
      (participantId) => participantId.toString() !== senderId
    );

    const newMessage = new Message({
      sender_id: senderId,
      receiver_id: receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // Check if there is an existing notification with the same boost_id
    let existingNotification = await Notification.findOne({
      boost_id,
      sender: senderId,
    });

    if (existingNotification) {
      await existingNotification.deleteOne();
    }

    const newNotification = new Notification({
      sender: senderId,
      receiver: receiverId,
      boost_id: boost_id,
      content: message,
      type: NOTIFICATION_TYPE.MESSAGE,
    });
    await newNotification.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification");
    }

    // // await conversation.save()
    // // await newMessage.save()

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALLY
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
