import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// for chatting
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!message || !receiverId) {
      return res.status(400).json({ success: false, message: "Message and receiver are required." });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create and store message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // Emit to receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    // Emit to sender too
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit('newMessage', newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });

  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    // Fetch messages with pagination
    const messages = await Message.find({ _id: { $in: conversation.messages } })
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

