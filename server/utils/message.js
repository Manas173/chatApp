var moment = require('moment');

var generateMessage = (from,text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
};

var generateLocationMessage = (from,text) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${text}`,
        createdAt: moment().valueOf()
    }
}

module.exports = {generateMessage,generateLocationMessage};