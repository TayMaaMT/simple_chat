const express = require('express');
const socketio = require('socket.io');
const namespaces = require('./data/namespaces');
const app = express();
app.use(express.static(__dirname + '/public'))

const serverexpress = app.listen(3000);
const io = socketio(serverexpress);
io.on('connection', (socket) => {
    const nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    })
    socket.emit('nsList', nsData);
})
namespaces.forEach((namespace) => {

    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        const username = nsSocket.handshake.query.username;
        console.log(`${nsSocket.id} has joind ${namespace.endpoint}`);
        nsSocket.emit('nsRoomLoad', namespace.rooms);
        nsSocket.on('joinRoom', (RoomToJoin, numberOfUsersCallback) => {
            const RoomToLeave = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(RoomToLeave);
            updateUserInRoom(namespace, RoomToLeave)
            nsSocket.join(RoomToJoin);
            // io.of(namespace.endpoint).in(RoomToJoin).clients((err, clients) => {
            //     console.log(clients);
            //     numberOfUsersCallback(clients.length);
            // })
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === RoomToJoin;
            })
            nsSocket.emit('historyCatchUp', nsRoom.history);
            updateUserInRoom(namespace, RoomToJoin)

        })

        nsSocket.on('messageToServer', (msg) => {
            const fullmsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: "https://via.placeholder.com/30"
            }
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomTitle;

            })
            nsRoom.addMessage(fullmsg);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClient', fullmsg)
        })
    })

})

function updateUserInRoom(namespace, RoomToJoin) {
    io.of(namespace.endpoint).in(RoomToJoin).clients((err, clients) => {
        io.of(namespace.endpoint).in(RoomToJoin).emit('updateNumbers', clients.length)
    })
}