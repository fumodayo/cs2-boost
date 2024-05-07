import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  // Thêm user vào userSocketMap
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Gửi danh sách người dùng trực tuyến cho tất cả các client
  }

  // Kiểm tra nếu user là booster thì thêm vào phòng "boosters"
  const user = await User.findById(userId);
  if (user && user.role.includes("booster")) {
    socket.join("boosters");
  }

  // Xử lý sự kiện ngắt kết nối
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Gửi lại danh sách người dùng trực tuyến cho tất cả các client
  });
});

export { app, io, server };
