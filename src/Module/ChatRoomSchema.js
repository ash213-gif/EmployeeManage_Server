const express = require('express');
const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
  Userid: { type: mongoose.Schema.Types.ObjectId, ref: 'Userdata', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Userdata', required: true },
  lastMessage: { type: String },
  lastMessageTime: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
})

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);