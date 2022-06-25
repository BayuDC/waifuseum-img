const { get } = require('https');
const { send } = require('micro');
const query = require('micro-query');
const { ObjectId } = require('mongodb');
const db = require('./db');

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
module.exports = async (req, res) => {
    // get query
    const { id } = query(req);
    if (!id || !ObjectId.isValid(id)) return send(res, 400);

    // fetch data
    const picture = await db.collection('pictures').findOne({ _id: new ObjectId(id) }, { projection: { url: 1 } });
    if (!picture) return send(res, 404);

    // download file
    const stream = await new Promise(resolve => {
        get('https://cdn.discordapp.com/attachments' + picture.url, res => {
            resolve(res.statusCode == 200 ? res : undefined);
        });
    });

    // TODO process file

    // send file
    res.setHeader('Content-Type', 'image/jpg');
    res.setHeader('Content-Disposition', `filename="${id}.jpg"`);

    return stream;
};
