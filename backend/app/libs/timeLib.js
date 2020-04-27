// importing moment
const moment = require('moment');

// wrapper around moment utc function to return current utc time
let now = () => {
    return moment.utc().format();
};

module.exports = {
    now: now
};