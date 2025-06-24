const express = require('express');
const route= express.Router()
const {UserCreate ,login ,userdelete } =require('../controller/User')


 // users routes CRUD operations 
route.post('/signup',UserCreate)
route.post('/login', login  )
route.delete('/deleteUser/:id', userdelete);


route.get('/',(req,res)=>{
    res.send('my routes my first api')
})

module.exports=route;