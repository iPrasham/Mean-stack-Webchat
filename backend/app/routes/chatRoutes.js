// importing node modules
const express = require('express');

// importing chat controller
const chatController = require('./../controllers/chatController');

// importing appConfig
const config = require('../../config/appConfig');

// importing route middleware
const routeMiddleware = require('./../middlewares/routeMiddleware');

let setRoutes = function (app) {
    let baseUrl = config.version + '/room';

    app.post(baseUrl + '/chat-list', routeMiddleware.verifyAuthToken, chatController.listChat);
};