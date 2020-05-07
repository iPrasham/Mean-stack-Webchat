// importing node modules
const mongoose = require('mongoose');

// importing libs
const logger = require('./../libs/loggerLib');
const response = require('./../libs/responseLib');

// importing mongoose models
const Chat = mongoose.model('Chat');
const Room = mongoose.model('Room');

// helper function to save chat
let saveChat = function (senderId, senderName, roomId, message) {
    let chat = new Chat({
        roomId: roomId,
        senderId: senderId,
        senderName: senderName,
        message: message
    });

    chat.save((err, result) => {
        if (err) {
            logger.error(err.message, 'Chat controller: Save chat', 10);
        }
    });
};


// as long as the user is valid and the roomId is valid he can access the chat history
// as all rooms are public anyway
let listChat = function (req, res) {
    let verifyRoom = function () {
        return new Promise((resolve, reject) => {
            if (!req.body.roomId) {
                let apiResponse = response.generate(true, 'Room id missing', 403, null);
                reject(apiResponse);
            } else {
                Room.findOne({ roomId: req.body.roomId, isActive: true })
                    .lean()
                    .exec((err, result) => {
                        if (err) {
                            logger.error(err.message, 'Chat controller: list chat', 10);
                            let apiResponse = response.generate(true, 'Internal server error', 500, null);
                            reject(apiResponse);
                        } else if (result.n == 1) {
                            resolve();
                        } else {
                            let apiResponse = response.generate(true, 'No such active room found', 404, null);
                        }
                    });
            }
        });
    };

    let getList = function () {
        return new Promise((resolve, reject) => {
            Chat.find({ roomId: req.body.roomId })
                .select("-__v -_id -roomId")
                .sort('createdOn')
                .lean()
                .exec((err, result) => {
                    if (err) {
                        logger.error(err.message, 'Chat controller: list chat - get list', 10);
                        let apiResponse = response.generate(true, 'Internal server error', 500, null);
                        reject(apiResponse);
                    } else {
                        let apiResponse = response.generate(false, 'Messages found', 200, result);
                        resolve(apiResponse);
                    }
                });
        });
    };

    verifyRoom()
        .then(getList)
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            res.send(err);
        });
};


module.exports = {
    saveChat: saveChat,
    listChat: listChat
};


