// importing event-emitter
const EventEmitter = require('events').EventEmitter;

// importing necessary libs
const mailer = require('./mailLib');
const chat = require('./../controllers/chatController');

// event emitter object that is used throughout the app to trigger common events
const eventEmitter = new EventEmitter();

eventEmitter.on('sendEmail', mailer.sendEmail);
eventEmitter.on('signupmail', mailer.signUpEmail);
eventEmitter.on('forgotPassEmail', mailer.forgotPassEmail);
eventEmitter.on('saveChat', chat.saveChat);

module.exports = {
    eventEmitter: eventEmitter
};
