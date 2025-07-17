const express = require('express');
const app = express.Router()

// Import routes
const {authenticateToken} =require('../verifytoken/VerifyToken');
const {createChat,getmessages }=require('../controller/ChatRoom');

app.post('/createChat', createChat);
app.get('/getmessages/:senderId', getmessages);


module.exports = app;