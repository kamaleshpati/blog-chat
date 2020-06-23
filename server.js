const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const conectDB = require('./db');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const bot = "chatAPPbot";


app.use(express.json());
conectDB();
const server = http.createServer(app);
const port = 3000;
const io = socketio(server);

let publicPath = path.join(__dirname, '/public');
app.use(express.static(publicPath));
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, '/index.html'));
});
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/userRoutes'));
app.use('/posts', require('./routes/postRoutes'));

// chat on when anyone connects
io.on("connection", socket => {

    console.log("new socket connected");
    socket.on('joinRoom', ({ username, room }) => {
        let user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit("message", formatMessage(bot, "welcome to chat"));
        socket.broadcast
            .to(user.room)
            .emit("message", formatMessage(bot, user.username + " has joined"));
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });


    socket.on('chatMessage', (msg) => {
        console.log(msg);
        let user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });
    socket.on('disconnect', () => {
        let user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit("message", formatMessage(bot, user.username + " has left"));
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }

    });
});

server.listen(port, () => console.log(`blog service listening at http://localhost:${port}`));