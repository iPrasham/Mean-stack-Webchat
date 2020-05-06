// importing mongoose module
const mongoose = require('mongoose');

// importing schema from mongoose
const Schema = mongoose.Schema;

// creating new schema
let roomModel = new Schema({
    roomId: { type: String, required: true, unique: true },
    creatorId: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    createdOn: { type: Date, default: Date.now }
});

mongoose.model('Room', roomModel);