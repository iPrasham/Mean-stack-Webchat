// importing node moduels
const express = require('express');

// importing room controller
const roomController = require('./../controllers/roomController');

// importing appConfig file
const config = require('../../config/appConfig');

// importing route middleware
const routeMiddleware = require('./../middlewares/routeMiddleware');

let setRoutes = function (app) {
    let baseUrl = config.version + '/room';

    // create room url
    app.post(baseUrl + '/create', routeMiddleware.verifyAuthToken, roomController.createRoom);

    // update room url
    app.post(baseUrl + '/update', routeMiddleware.verifyAuthToken, roomController.updateRoom);

    // deactivate room url
    app.post(baseUrl + '/deactivate', routeMiddleware.verifyAuthToken, roomController.deactivateRoom);

    // activate room url
    app.post(baseUrl + '/activate', routeMiddleware.verifyAuthToken, roomController.activateRoom);

    // delete room url
    app.post(baseUrl + '/delete', routeMiddleware.verifyAuthToken, roomController.deleteRoom);

    // get room list url
    app.post(baseUrl + '/list', routeMiddleware.verifyAuthToken, roomController.listRooms);

}

module.exports = {
    setRoutes: setRoutes
}