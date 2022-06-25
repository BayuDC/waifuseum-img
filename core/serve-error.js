const { send } = require('micro');

module.exports = (res, err) => {
    console.log(err);
    send(res, 400);
};
