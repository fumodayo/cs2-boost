import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
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

    // // await conversation.save()
    // // await newMessage.save()

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALLY
    const receiverSocketId = getReceiverSocketId(receiverId);
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
