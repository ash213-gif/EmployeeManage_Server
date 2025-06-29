const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/routes')
const taskroutes = require('./routes/taskrooutes');

app.use(cors({
    origin: ['https://employe-manage-front.vercel.app', 'http://localhost:5173']
}));
app.use(express.json());
const port = process.env.PORT || 4040;

app.use('/', routes);
app.use('/', taskroutes);

mongoose.connect(process.env.MongoDBurl)
    .then(() => { console.log('mongoDB  is cooneted '); })
    .catch((e) => { console.log(e); })

app.use('/', routes);

app.listen(port, () => { console.log(`port is running on ${port} `); })