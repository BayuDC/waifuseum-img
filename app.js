const getQuery = require('./core/get-query');
const getPicture = require('./core/get-picture');
const getStream = require('./core/get-stream');
const processFile = require('./core/process-file');
const serveFile = require('./core/serve-file');
const serveError = require('./core/serve-error');

const collection = new Map();

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
module.exports = async (req, res) => {
    try {
        const { id } = getQuery(req);

        const cache = collection.get(id);
        if (!cache) {
            const picture = await getPicture(id);
            const stream = await getStream(picture);
            const file = await processFile(stream, id + '.jpg');

            collection.set(id, file.name);

            serveFile(res, file.name);
        } else {
            serveFile(res, cache);
        }
    } catch (err) {
        serveError(res, err);
    }
};
