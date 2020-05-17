const express = require('express');
const socketio = require('socket.io');
const app = express();
app.use(express.static(__dirname + '/public'))

const serverexpress = app.listen(3000);
const io = socketio(serverexpress);
io.on('connection', (socket) => {

    // console.log("data");
    socket.on('messageToServer', (msg) => {

        io.emit('messageToClient', { text: msg.text })
    });

})