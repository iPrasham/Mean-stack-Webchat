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

// routing imports