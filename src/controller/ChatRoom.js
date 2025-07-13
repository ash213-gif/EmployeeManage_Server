const express = require("express");
const Message = require("../Module/MessageSchem");
const ChatRoom = require("../Module/ChatRoomSchema");

// chat room setup

exports.chatroom = async (req, res) => {
  try {
    const { userId, role } = req.query;

    let chatRooms;
    if (role === "admin") {
      chatRooms = await ChatRoom.find({ adminId: userId })
        .populate("userId", "username email")
        .sort({ lastMessageTime: -1 });
    } else {
      chatRooms = await ChatRoom.find({ userId })
        .populate("adminId", "username email")
        .sort({ lastMessageTime: -1 });
    }

    res.send(chatRooms);
  } catch (e) {
    return res.status(500).send({ status: false, msg: e.message });
  }
};

// get message from user to admin
exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { Userid } = req.user;

    const chatRoom = await ChatRoom.findById(roomId);
    if (
      !chatRoom ||
      (chatRoom.userId.toString() !== userId &&
        chatRoom.adminId.toString() !== userId)
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: chatRoom.userId, receiverId: chatRoom.adminId },
        { senderId: chatRoom.adminId, receiverId: chatRoom.userId },
      ],
    })
      .populate("senderId", "username")
      .populate("receiverId", "username")
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (e) {
    console.log(e)
    return res.status(500).send({ status: false, msg: e.message });
  }
};
