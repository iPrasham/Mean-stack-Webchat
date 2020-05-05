//importing pino module
const pino = require('pino');

// wrapper functions around the Pino logger to log error
const logger = pino();

// importing timeLib library from Libs
const time = require('./timeLib');

let captureError = (errorMessage, errorOrigin, errorLevel) => {
    let error = {
        dateTime: time.now(),
        errorMessage: errorMessage,
        errorOrigin: errorOrigin,
        errorLevel: errorLevel
    };
    logger.error(error);
};

let captureInfo = (message, origin, importance) => {
    let info = {
        dateTime: time.now(),
        message: message,
        origin: origin,
        level: importance
    };
    logger.info(info);
};

module.exports = {
    error: captureError,
    info: captureInfo
};