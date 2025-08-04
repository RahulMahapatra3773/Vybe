import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:process.env.URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const userSocketMap = {};
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap));
  socket.join(userId);
  socket.on('typing', ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', { senderId: userId });
    }
  });
  socket.on('likeOrDislike', (notification) => {
    const { receiverId, type } = notification;
    if (receiverId && (type === 'like' || type === 'dislike')) {
      io.to(receiverId).emit('getNotification', notification);
    }
  });
  socket.on('disconnect', () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { app, server, io };
