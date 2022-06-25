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

    if (!id || !ObjectId.isValid(id)) return send(res, 404);

    return 'Done';
};
