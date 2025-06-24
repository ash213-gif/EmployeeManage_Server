const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes/routes')

app.use(express.json());

const port = process.env.PORT || 4040;

mongoose.connect ( process.env.MongoDBurl )
.then(()=>{ console.log('mongoDB  is cooneted '); })
.catch((e)=>{ console.log(e); })

app.use('/', routes)

app.listen(port,()=>{ console.log(` port is running on ${port} `); })