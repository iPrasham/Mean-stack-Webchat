// importing node modules
const express = require('express');

// importing controller
const userController = require('./../controllers/userController');

// importing defaut config file
const config = require('../../config/appConfig');

// importing middleware
const routeMiddleware = require('./../middlewares/routeMiddleware');

let setRoutes = function (app) {
    let baseUrl = config.version + '/user';

    // signup route
    app.post(baseUrl + '/signup', userController.signup);

    // login route
    app.post(baseUrl + '/login', userController.login);

    // forgot password url
    app.post(baseUrl + '/forgot-password', userController.forgotPassword);
}

module.exports = {
    setRoutes: setRoutes
}