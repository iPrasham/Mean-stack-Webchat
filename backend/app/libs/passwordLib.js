const bcrypt = require('bcrypt');
const saltRounds = 10;

let encryptPassword = function (password) {
    return bcrypt.hashSync(password, saltRounds);
};  // we need the password immediately as we need to generate the user and save.
    // so we return the encrypted password.

let comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, callback);
};

module.exports = {
    encryptPassword: encryptPassword,
    comparePassword: comparePassword
};