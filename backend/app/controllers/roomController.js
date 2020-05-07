// importing node modules
const mongoose = require('mongoose');
const shortId = require('short-id');

// importing libs
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const eventEmitter = require('./../libs/eventLib').eventEmitter;

// importing mongoose model
const Room = mongoose.model('Room');

// creating a room
let createRoom = function (req, res) {
    if (!req.body.name) {
        let apiResponse = response.generate(true, 'Room name is missing', 403, null);
        res.send(apiResponse);
    } else {
        let room = new Room({
            roomId: shortId.generate(), 
            creatorId: req.user.userId,
            name: req.body.name 
        });

        room.save((err, result) => {
            if (err) {
                logger.error(err.message, 'Room controller: Create room', 5);
                let apiResponse;
                if (err.name == 'ValidationError') {
                    apiResponse = response.generate(true, err.message, 403, null);
                } else {
                    apiResponse = response.generate(true, 'Internal server error', 500, null);
                }
                res.send(apiResponse);
            } else {
                let apiResponse = response.generate(false, 'Room created', 200, null);
                res.send(apiResponse);
                eventEmitter.emit('roomListUpdated');
            }
        });
    }
};


// updating a room
let updateRoom = function (req, res) {
    if (!(req.body.name && req.body.roomId)) {
        let apiResponse = response.generate(true, 'Room name and Room Id are required', 403, null);
        res.send(apiResponse);
    } else {
        Room.updateOne({ creatorId: req.user.userId, roomId: req.body.roomId }, { name: req.body.name })
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Room controller: Update room', 5);
                    let apiResponse = response.generate(true, 'Interal server error', 500, null);
                    res.send(apiResponse);
                } else if (result.n == 1) {     // result.n => gives no of documents matched
                    let apiResponse = response.generate(false, 'Room name updated', 200, null);
                    res.send(apiResponse);
                    eventEmitter.emit('roomListUpdated');
                    eventEmitter.emit('roomNameUpdated', req.body.roomId, req.body.name);
                } else {
                    let apiResponse = response.generate(true, 'No such room or Unauthorized action', 404, null);
                    res.send(apiResponse);
                }
            });
    }
};


let deactivateRoom = function (req, res) {
    if (!req.body.roomId) {
        let apiResponse = response.generate(true, 'Room id is required', 403, null);
        res.send(apiResponse);
    } else {
        Room.updateOne({ creatorId: req.user.userId, roomId: req.body.roomId }, { isActive: false })
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Room controller: Deactivate room', 5);
                    let apiResponse = response.generate(true, 'Internal server error', 500, null);
                    res.send(apiResponse);
                } else if (result.n == 1) {
                    let apiResponse = response.generate(false, 'Room deactivated', 200, null);
                    res.send(apiResponse);
                    eventEmitter.emit('roomListUpdated');
                    eventEmitter.emit('roomRemoved', req.body.roomId);
                } else {
                    let apiResponse = response.generate(true, 'No such room or unauthorized action', 404, null);
                    res.send(apiResponse);
                }
            });
    }
};


let activateRoom = function (req, res) {
    if (!req.body.roomId) {
        let apiResponse = response.generate(true, 'Room id is required', 403, null);
        res.send(apiResponse);
    } else {
        Room.updateOne({ creatorId: req.user.userId, roomId: req.body.roomId}, { isActive: true })
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Room controller: Activate room', 5);
                    let apiResponse = response.generate(true, 'Internal server error', 500, null);
                    res.send(apiResponse);
                } else if (result.n == 1) {
                    let apiResponse = response.generate(false, 'Room activated', 200, null);
                    res.send(apiResponse);
                    eventEmitter.emit('roomListUpdated');
                } else {
                    let apiResponse = response.generate(true, 'No such room aur unauthorized action', 404, null);
                    res.send(apiResponse);
                }
            });
    }
};


let deleteRoom = function (req, res) {
    if (!req.body.roomId) {
        let apiResponse = response.generate(true, 'Room id is required', 403, null);
        res.send(apiResponse);
    } else {
        Room.deleteOne({ createRoom: req.user.userId, roomId: req.body.userId })
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Room controller, delete room', 5);
                    let apiResponse = response.generate(true, 'Internal server error', 500, null);
                    res.send(apiResponse);
                } else if (result.n == 1) {
                    let apiResponse = response.generate(false, 'Room deleted', 200, null);
                    res.send(apiResponse);
                    eventEmitter.emit('roomRemoved', req.body.roomId);
                    eventEmitter.emit('roomListUpdated');
                } else {
                    let apiResponse = response.generate(true, 'No such room or unauthorized action', 404, null);
                    res.send(apiResponse);
                }
            });
    }
};


let listRooms = function (req, res) {
    Room.find()
        .or([{ creatorId: req.user.userId}, { isActive: true }])    // return room that are active or are created by this user
        .select("-_id -__v -createdOn")
        .sort("-isActive")
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'Room controller: list room', 5);
                let apiResponse = response.generate(true, 'Internal server error', 500, null);
            } else {
                let apiResponse = response.generate(false, 'Room list found', 200, result);
                res.send(apiResponse);
            }
        });
};


module.exports = {
    createRoom: createRoom,
    updateRoom: updateRoom,
    deactivateRoom: deactivateRoom,
    activateRoom: activateRoom,
    deleteRoom: deleteRoom,
    listRooms: listRooms
};