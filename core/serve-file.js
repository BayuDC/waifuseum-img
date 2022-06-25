const { createReadStream } = require('fs');
const { send } = require('micro');

module.exports = (res, file) => {
    const stream = createReadStream(file.path);

    res.setHeader('Content-Type', 'image/jpg');
    res.setHeader('Content-Disposition', `filename="${file.name}"`);
    send(res, 200, stream);
};
