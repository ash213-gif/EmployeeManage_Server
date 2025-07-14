const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require("socket.io");
const routes = require('./routes/routes')
const taskroutes = require('./routes/taskrooutes');
const chatroutes = require('./routes/ChatRoutes');

const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: "*" }
});


app.use(cors({
    origin: ['https://employe-manage-front.vercel.app', 'http://localhost:5173']
}));

app.use(express.json());
const port = process.env.PORT || 4040;

mongoose.connect(process.env.MongoDBurl)
 .then(() => { console.log('mongoDB  is cooneted '); })
 .catch((e) => { console.log(e); })

 const onlineUsers = new Map();

app.use('/', routes);
app.use('/', taskroutes);
app.use('/', chatroutes);


io.on("connection", (socket) => {
  console.log("New socket connection");

  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    const newMsg = new Message({ senderId, receiverId, message });
    await newMsg.save();

    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", newMsg);
    }
  });

  socket.on("disconnect", () => {
    for (let [uid, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(uid);
        break;
      }
    }
  });
});

server.listen(port, () => { console.log(`port is running on ${port} `); })
