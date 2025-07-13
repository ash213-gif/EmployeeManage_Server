const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now } ,
      isRead: { type: Boolean, default: false }
   
} ,{ timestamps:true } )

module.exports = mongoose.model('Message', MessageSchema);