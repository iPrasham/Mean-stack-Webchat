// importing necessary node modules
const express = require('express');
const http = require('http');
const bodyparser = require('body-parser');      // its a middleware too
const helmet = require('helmet');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

// importing appConfig for default properties
const config = require('./config/appConfig');

// importing middlewares
const errorHandlers = require('./app/middlewares/appErrorHandler');
const routeLogger = require('./app/middlewares/routeLogger');

// importing logger Lib
const logger = require('./app/libs/loggerLib');

const app = express();
const server = http.createServer(app);

// parsing only json
app.use(bodyparser.json());

// parsing only urlencoded bodies
app.use(bodyparser.urlencoded({ extended: false}));

// securing express app through helmet, i.e. setting various headers
app.use(helmet());

app.use(express.static(path.join(__dirname, 'client')));

// parsing through middlewares
app.use(routeLogger.logIp);
app.use(errorHandlers.globalErrorHandler);

// importing mongoose models
let modelPath = './app/models';
fs.readdirSync(modelPath).forEach((file) => {
    if (file.indexOf('.js') >= 0) {
        require(modelPath + '/' + file);
    }
});

// routing imports
let routePath = './app/routes';
fs.readdirSync(routePath).forEach((file) => {
    if (file.indexOf('js') >= 0) {
        require(routePath + '/' + file).setRoutes(app);
    }
});

// not found error handler
app.use(errorHandlers.globalNotFoundHandler);

// listening to server
server.listen(config.port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
        logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10);
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(error.code + ':elevated priviledges required', 'serverOnErrorHandler', 10);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
            process.exit(1);
            break;
        default:
            logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    ('Listening on ' + bind);
    logger.info('Server listening on port ' + addr.port, 'serverOnListeningHandler', 10);
    let db = mongoose.connect(config.database.url, { useNewUrlParser: true });
}

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

// mongoose event handlers
mongoose.connection.on('open', (err) => {
    if (err) {
        console.log("Database error");
    } else {
        console.log('Connected to DB');
    }
});

mongoose.connection.on('error', (err) => {
    console.log("Error connecting to DB");
    console.log(err);
});