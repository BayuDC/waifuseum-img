const { send } = require('micro');

const getQuery = require('./core/get-query');
const getPicture = require('./core/get-picture');
const getStream = require('./core/get-stream');
const processFile = require('./core/process-file');
const serveFile = require('./core/serve-file');
const serveError = require('./core/serve-error');

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

        serveFile(res, file);
    } catch (err) {
        serveError(res, err);
    }
};
