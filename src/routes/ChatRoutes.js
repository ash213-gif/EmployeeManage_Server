const express = require('express');
const app = express.Router()

// Import routes
const {authenticateToken} =require('../verifytoken/VerifyToken');
const {chatroom , getMessages }=require('../controller/ChatRoom');

app.get('/chatroom', chatroom);
app.get('/getMessages/:roomId', authenticateToken, getMessages);

module.exports = app;