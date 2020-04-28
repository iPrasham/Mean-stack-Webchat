// importing jwt module
const jwt = require('jsonwebtoken');

const config = require('../../config/appConfig');

const secret = '59BEEBC54941B2BEE9F7E3FB12851';

let generateToken = function (userData, callback, isPasswordReset = false) {
    let payload = {
        user: userData,
        exp: Math.round(Date.now() / 1000) + config.tokenExpiry * 60 * 60,
        sub: isPasswordReset ? 'PasswordReset' : 'AuthToken',
        iss: 'Webchat'
    };

    jwt.sign(payload, secret, {}, callback);
};

let verifyToken = function (token, callback) {
    jwt.verify(token, secret, {}, callback);
};

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken
}
