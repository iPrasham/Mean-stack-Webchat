// importing node modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let authModel = new Schema({
    authToken: { type: String, required: true },
    createdOn: { type: Date, default: Date.now }
});

mongoose.model('Auth', authModel);