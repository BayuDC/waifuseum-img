const { send } = require('micro');

const getQuery = require('./core/get-query');
const getPicture = require('./core/get-picture');
const getStream = require('./core/get-stream');
const processFile = require('./core/process-file');

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
module.exports = async (req, res) => {
    try {
        const { id } = getQuery(req);
        const picture = await getPicture(id);
        const stream = await getStream(picture);
        const file = await processFile(stream, id + '.jpg');

        // res.setHeader('Content-Type', 'image/jpg');
        // res.setHeader('Content-Disposition', `filename="${id}.jpg"`);
        send(res, 200);
    } catch (err) {
        console.log(err);
        send(res, 400);
    }
};
