const mongoose = require('mongoose')

const UserSchem = new mongoose.Schema({
    name: { type: String, required: true, trim: true, },
    ProfileImg: { type:String , required: false, trim: true, },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    otp: { type: String,  trim:true  },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isverify: { type: Boolean, default: false },
    isdelete: { type: Boolean, default: false },
Tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]})

module.exports = mongoose.model('Userdata', UserSchem)