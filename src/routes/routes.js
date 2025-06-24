const express = require('express');
const route= express.Router()
const {UserCreate ,login } =require('../controller/User')


route.post('/signup',UserCreate)
route.post('/login', login  )

route.get('/',(req,res)=>{
    res.send('my routes my firsdt api')
})

module.exports=route;