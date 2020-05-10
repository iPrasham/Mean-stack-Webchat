// importing node modules
const socketio = require('socket.io');

// importing libs
const eventEmitter = require('./../libs/eventLib').eventEmitter;
const tokenLib = require('./../libs/tokenLib');

// importing app config file
const config = require('../../config/appConfig');

let setSocketServer = function (server) {
    let socketServer = socketio.listen(server).of(config.version + '/chat');

    // when a new user connects to socket server
    socketServer.on('connection', (socket) => {
        console.log('A user tried to connect..');
        
        // server socket requests client socket to verify the user
        socket.emit('verifyUser', '');
        
        // server socket listens to setUser event emitted by client socket
        socket.on('setUser', (authToken) => {
            tokenLib.verifyToken(authToken, (err, decoded) => {
                if (err) {
                    console.log('Auth error');
        
                    // server socket fires authError event to client socket
                    socket.emit('authError', '');
                } else {
                    socket.userId = decoded.user.userId;
                    socket.username = (`${decoded.user.firstname} ${decoded.user.lastname}`).trim();
                    console.log(socket.username + ' connected to socket server');
                }
            });
        });

        // when client socket emits a join room event
        socket.on('joinRoom', (roomId) => {
            if (socket.roomId != roomId) {
                // leave the current room if any
                if (socket.roomId) {
                    // emit user left to client socket in the room the user was present
                    socket.to(socket.roomId).broadcast.emit('userLeft', socket.username);
                    // as the name specifies - to leave the room
                    socket.leave(socket.roomId);
                }

                // join another room - the room id
                socket.roomId = roomId;
                // name of the room to be joined
                socket.join(roomId);
                // emit new user joined to client socket in the new room
                socket.to(socket.roomId).broadcast('userJoin', socket.username);
            }
        });


        // when user leaves a room event
        socket.on('leaveRoom', () => {
            if (socket.roomId) {
                // emit user left message to room
                socket.to(socket.roomId).broadcast.emit('userLeft', socket.username);
                socket.leave(socket.roomId);
                socket.roomId = undefined;
            }
        });


        // when client socket sends message to the room he is in
        socket.on('newChat', (message) => {
            if (socket.roomId && socket.userId) {
                // message event fired by the server socket
                socket.to(socket.roomId).broadcast.emit('newChat', {
                    message: message,
                    senderId: socket.userId,
                    senderName: socket.username,
                    createdOn: Date.now()
                });
                // save chat event fired
                eventEmitter.emit('saveChat', socket.userId, socket.username, socket.roomId, message);
            } else if (!socket.roomId) {
                // event fired bt the server when the user is not in room
                socket.emit('notInARoom', '');
            } else {
                // event fired by the server when user is not a valid user
                socket.emit('authError', '');
            }
        });


        // when client socket fires a type event
        socket.on('typing', () => {
            if (socket.roomId && socket.userId) {
                // emit type event by server
                socket.to(socket.roomId).broadcast.emit('typing', socket.username);
            } else if (!socket.roomId) {
                socket.emit('notInARoom', '');
            } else {
                socket.emit('authError', '');
            }
        });


        // when room name is updated
        eventEmitter.on('roomNameUpdated', (roomId, name) => {
            if (socket.roomId == roomId) {
                // socket server fires room name update event to all client sockets
                socket.emit('roomNameUpdated', name);
            }
        });


        // when the room is deleted or deactivated
        eventEmitter.on('roomRemoved', (roomId) => {
            if (socket.roomId == roomId) {
                // emit remove room event to client socket
                socket.emit('roomRemoved', '');
                // force leave all client sockets
                socket.leave(socket.roomId);
                socket.roomId = undefined;
            }
        });


        // when client socket fires disconnect event
        socket.on('disconnect', () => {
            if (socket.roomId) {
                // broadcast leave message to other client sockets
                socket.to(socket.roomId).broadcast.emit('userLeft', socket.username);
                // leave room
                socket.leave(socket.roomId);
            }
        });

    });


    // when any changes in the room list occur this event will notify all the sockets connected to the server
    eventEmitter.on('roomListUpdated', () => {
        socketServer.emit('roomListUpdated', '');
    });

};

module.exports = {
    setSocketServer: setSocketServer
};