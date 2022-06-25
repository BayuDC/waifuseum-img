const { createReadStream } = require('fs');
const { send } = require('micro');

module.exports = (res, fileName) => {
    const stream = createReadStream('./data/' + fileName);

    res.setHeader('Content-Type', 'image/jpg');
    res.setHeader('Content-Disposition', `filename="${fileName}"`);
    send(res, 200, stream);
};
