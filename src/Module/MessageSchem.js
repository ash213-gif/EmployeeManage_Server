const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Userdata" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Userdata" },
    message: { type:String, required: true , trim: true },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
