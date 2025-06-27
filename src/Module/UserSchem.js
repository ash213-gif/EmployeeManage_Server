const mongoose =require('mongoose')

const UserSchem=  new mongoose.Schema({
    name:{ type:String , required:true , trim:true , unique:false },
    email:{ type:String , required:true , unique:false , trim:true  },
    password:{ type:String , required:true , trim:true  },
    otp:{ type:Number , default:0  },
   role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isverify:{ type:Boolean , default: false   },
    isdelete:{ type:Boolean  , default:false  }
})  

module.exports= mongoose.model('Userdata' , UserSchem)