const fs = require('fs');
const { send } = require('micro');

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
module.exports = async (req, res) => {
    const id = '62b6cd35767a5ef421e8d6e4';
    const path = './data/' + id;
    const file = fs.createReadStream(path);

    res.setHeader('Content-Type', 'image/jpg');
    res.setHeader('Content-Disposition', `filename="${id}.jpg"`);

    return file;
};
