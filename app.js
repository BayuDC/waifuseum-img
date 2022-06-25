const { send } = require('micro');

const getQuery = require('./core/get-query');
const getPicture = require('./core/get-picture');
const getFile = require('./core/get-file');

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
module.exports = async (req, res) => {
    try {
        const { id } = getQuery(req);
        const picture = await getPicture(id);
        const stream = await getFile(picture);

        res.setHeader('Content-Type', 'image/jpg');
        res.setHeader('Content-Disposition', `filename="${id}.jpg"`);
        send(res, 200, stream);
    } catch (err) {
        console.log(err);
        send(res, 400);
    }
};
