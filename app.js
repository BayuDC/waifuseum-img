const { send } = require('micro');
const query = require('micro-query');
const { ObjectId } = require('mongodb');
const db = require('./db');

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
module.exports = async (req, res) => {
    const { id } = query(req);

    if (!id || !ObjectId.isValid(id)) return send(res, 400);

    const picture = await db.collection('pictures').findOne({ _id: new ObjectId(id) }, { projection: { url: 1 } });

    if (!picture) return send(res, 404);

    return { picture };
};
