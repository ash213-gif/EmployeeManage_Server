const express = require('express');
const route= express.Router()
const {UserCreate ,login ,userdelete , verifyotp } =require('../controller/User')
const multer = require('multer');


// Set storage engine for multer
const storage = multer.diskStorage({});


const upload = multer({ storage: storage });

// users routes CRUD operations 

 // users routes CRUD operations 
route.post('/signup', upload.single('ProfileImg') ,UserCreate)
route.post('/login', login  )
route.post('/verifyotp/:id' ,verifyotp )
route.delete('/deleteUser/:id', userdelete);



route.get('/',(req,res)=>{
    res.send('my routes my first api')
})

module.exports=route;