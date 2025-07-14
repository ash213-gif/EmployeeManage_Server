const express = require('express');
const app = express.Router()

// Import routes
const {authenticateToken} =require('../verifytoken/VerifyToken');
const {chatroom , getMessages ,chatstart , sendMessage }=require('../controller/ChatRoom');

app.get('/chatroom', chatroom);
app.get('/getMessages/:roomId', authenticateToken, getMessages);
app.post('/chatstart', authenticateToken, chatstart);
app.post('/sendMessage', authenticateToken, sendMessage);

module.exports = app;