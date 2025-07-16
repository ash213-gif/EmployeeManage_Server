const express = require("express");
const Message = require("../Module/MessageSchem");
const ChatRoom = require("../Module/ChatRoomSchema");
const User = require("../Module/UserSchem");

exports.createChat = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        // Validate input
        if (!senderId || !receiverId || !message) {
            return res.status(400).send({ status: false, msg: "All fields are required" });
        }

        // Check if sender exists
        const sender = await User.findById(senderId);
        if (!sender) {
            return res.status(404).send({ status: false, msg: "Sender not found" });
        }

        // Create a new message
        const messageData = new Message({ UserId: senderId, message }); // Use UserId for consistency
        await messageData.save();

        // Find existing chat room
        let chatRoom = await ChatRoom.findOne({
            participants: { $all: [senderId, receiverId], $size: 2 }
        });

        // Update existing chat room or create a new one
        if (chatRoom) {
            // Update the chat room with the new message ID
            chatRoom.messages.push(messageData._id); // Add the message ID to the messages array
            chatRoom.lastMessage = message;
            chatRoom.lastMessageTime = new Date();
            await chatRoom.save(); // Save the updated chat room
        } else {
            // Create a new chat room
            chatRoom = new ChatRoom({
                participants: [senderId, receiverId],
                messages: [messageData._id], // Start with the first message
                lastMessage: message,
                lastMessageTime: new Date()
            });
            await chatRoom.save(); // Save the new chat room
        }

        // Send response
        return res.status(201).send({ status: true, data: messageData, chatRoom: chatRoom });
    } catch (e) {
        console.log(e);
        res.status(500).send({ status: false, msg: e.message });
    }
};

exports.getmessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body; // Expecting body parameters
    if (!senderId || !receiverId) {
      return res.status(400).send({ status: false, msg: "All fields are required" });
    }

    const chatRoom = await ChatRoom.findOne({ participants: { $all: [senderId, receiverId], $size: 2 } }).populate('messages');

    if (!chatRoom) {
      return res.status(404).send({ status: false, msg: "Chat room not found" });
    }

    return res.status(200).send({ status: true, data: chatRoom.messages });

  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: false, msg: e.message });
  }
}
