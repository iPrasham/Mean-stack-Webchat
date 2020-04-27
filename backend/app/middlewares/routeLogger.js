const config = require('../../config/appConfig');
const logger = require('./../libs/loggerLib');

let requestIpLogger = (req, res, next) => {
    let remoteIp = req.connection.remoteAddress + '://' + req.connection.remotePort;
    let realIp = req.headers['X-REAL-IP'];
    logger.info(
        `${req.method} Request made from ${remoteIp} for route ${req.originalUrl}`,
        'Route Logger',
        1
    );
    
    if(req.method === 'OPTIONS'){
        console.log('!OPTIONS');
        var headers = {};
        headers['Access-Control-Allow-Origin'] = config.allowedOrigins;
        headers['Access-Control-Allow-Methods'] = "POST, GET, PUT, DELETE, OPTIONS";
        headers['Access-Control-Allow-Credentials'] = false;
        headers['Access-Control-Max-Age'] = "86400";    // 24 hrs
        headers['Access-Control-Allow-Headers'] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    }else{
        // enable or disable cors here
        res.header('Access-Control-Allow-Origin', config.allowedOrigins);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        // end cors config
        next();
    }
};      // end request ip logger function

module.exports = {
    logIp: requestIpLogger
};