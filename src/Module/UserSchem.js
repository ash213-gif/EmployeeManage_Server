const mongoose =require('mongoose')

const UserSchem=  new mongoose.Schema({
    name:{ type:String , required:true , trim:true  },
    email:{ type:String , required:true , trim:true  },
    password:{ type:String , required:true , trim:true  },
    otp:{ type:Number , default:0  },
    isverify:{ type:Boolean , default: false   },
    isdelete:{ type:Boolean  , default:false  }
})

module.exports= mongoose.model('Userdata' , UserSchem)