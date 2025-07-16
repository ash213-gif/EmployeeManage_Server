const express = require('express');
const app = express.Router()

// Import routes
const {authenticateToken} =require('../verifytoken/VerifyToken');
const {createChat,getmessages }=require('../controller/ChatRoom');

app.post('/createChat', createChat);
app.post('/getmessages', getmessages);


module.exports = app;