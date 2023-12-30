const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes')
const messageRoutes = require('./routes/messages.routes')



require('dotenv').config()
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const mongourl = process.env.MONGO_URL;
mongoose.connect(mongourl).then(() => {
    console.log('connected to db')
}).catch((err) => {
    console.log(err)
})

let chatRoom = '';
let allUsers = [];
let chatRoomUsers;
app.use(cors());
let gameUser = []
let guessArray = []

io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('joinGame', (data) => {
        let room = 'new';
        gameUser.push(data.username);
        console.log('gameUser', gameUser);
        socket.join(room);
        io.to(room).emit('gameUser', gameUser);

        // Attach the 'guess' event inside the 'joinGame' event
        socket.on('guess', (guessData) => {
            console.log(guessData);
            guessArray.push(guessData);
            console.log(guessArray.length);

            if (guessArray.length === 2) {
                if (guessArray[0].number === guessArray[1].number) {
                    io.to(room).emit('result', 'Draw');
                    console.log('Draw');
                } else if (guessArray[0].number > guessArray[1].number) {
                    io.to(room).emit('result', `${guessArray[0].username} is the winner`);
                    console.log(`${guessArray[0].username} is the winner`);
                } else {
                    io.to(room).emit('result', `${guessArray[1].username} is the winner`);
                    console.log(`${guessArray[1].username} is the winner`);
                }
                guessArray = [];
            }
        });
    });


    socket.on('join_room', (data) => {
        const { username, room } = data;
        socket.join(room);

        let __createdtime__ = Date.now();

        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        io.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);
        // io.to(room).emit('receive_message', {
        //     message: `${username} joined the room`,
        //     username: username,
        //     __createdtime__
        // });

        socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: username,
            __createdtime__
        });

        // Broadcast the join message to all other users in the room
        socket.broadcast.to(room).emit('receive_message', {
            message: `${username} joined the room`,
            username: username,
            __createdtime__
        });
    });

    socket.on('send_message', (data) => {
        console.log(data);

        io.to(data.room).emit('receive_message', {
            message: data.message,
            username: data.username,
            __createdtime__: data.__createdtime__
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        // const newUser = gameUser.filter((user) => user !== user);
        // gameUser = newUser
        allUsers = allUsers.filter((user) => user.id !== socket.id);
        chatRoomUsers = allUsers.filter((user) => user.room === chatRoom);
        io.to(chatRoom).emit('chatroom_users', chatRoomUsers);
        io.to(chatRoom).emit('receive_message', {
            message: `A user has left the room`,
            username: 'Admin',
            __createdtime__: Date.now()
        });

        socket.leave(chatRoom);

    });
});


app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.use('/api/auth', authRoutes)
app.use('/api/room', roomRoutes)
app.use('/api/messages', messageRoutes)

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
