// importing node modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userModel = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, default: '' },
    userId: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    signUpDate: { type: Date, default: Date.now },
    email: { type: String, required: true }, 
    passwordResetToken: { type: String, default: '' }
});

mongoose.model('User', userModel);