
const express = require("express");
const mongoose = require("mongoose");
const ChatRoom = require("../Module/ChatRoomSchema");
const Message = require("../Module/MessageSchem");
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
        const messageData = new Message({ senderId, receiverId, message }); // Include receiverId
        await messageData.save();

        // Find existing chat room
        let chatRoom = await ChatRoom.findOne({
            participants: { $all: [senderId, receiverId], $size: 2 }
        });

        // Update existing chat room or create a new one
        if (chatRoom) {
            chatRoom.messages.push(messageData._id); 
            chatRoom.lastMessage = message;
            chatRoom.lastMessageTime = new Date();
            await chatRoom.save(); // Save the updated chat room
        } else {
           
            chatRoom = new ChatRoom({
                participants: [senderId, receiverId],
                messages: [messageData._id],
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
        const { senderId } = req.params;
        const { receiverId } = req.query;

        if (!receiverId) {
            return res.status(400).send({ status: false, msg: "ReceiverId is required" });
        }

        const chatRoom = await ChatRoom.findOne({
            participants: { $all: [senderId, receiverId], $size: 2 }
        }).populate({
            path: 'messages',
            options: { sort: { 'createdAt': 1 } }
        });

        if (!chatRoom) {
            return res.status(200).send({ status: true, data: [] });
        }

        return res.status(200).send({ status: true, data: chatRoom.messages });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ status: false, msg: e.message });
    }
};