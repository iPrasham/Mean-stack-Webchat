// importing necessary modules
const mongoose = require('mongoose');
const shortId = require('short-id');

// importing libs
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const validationLib = require('./../libs/validationLib');
const passwordLib = require('./../libs/passwordLib');
const tokenLib = require('./../libs/tokenLib');
const eventEmitter = require('./../libs/eventLib');

// importing mongo models
const User = mongoose.model('User');
const Auth = mongoose.model('Auth');

// signup handler
let signup = function (req, res) {
    
    // validating user input
    let verifyUserInput = function () {
        return new Promise((resolve, reject) => {
            if(!validationLib.isValidEmail(req.body.email)) {
                let apiResponse = response.generate(true, "Invalid Email Address", 403, null);
                reject(apiResponse);
            }

            if(req.body.password == undefined || !validationLib.isValidPassword(req.body.password)) {
                let apiResponse = response.generate(true, "Invalid password pattern.Password should be minimum 8 characters and start with an alphabet or a number", 403, null);
                reject(apiResponse);
            }

            resolve();
        });
    };

    //check existing user
    let checkExistingUser = function () {
        return new Promise((resolve, reject) => {
            User.findOne({ email: req.body.email })
                .lean()
                .exec((err, result) => {
                    if(err){
                        logger.error(err.message, "User Signup: check existing user", 5);
                        let apiResponse = response.generate(true, "Some error occured.", 500, null);
                        reject(apiResponse);
                    } else if(result) {
                        let apiResponse = response.generate(true, "Email already registered.", 403, null);
                        reject(apiResponse);
                    } else {
                        resolve();
                    }
            });
        });
    };

    // saving user data into database
};


