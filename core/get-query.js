const query = require('micro-query');
const { ObjectId } = require('mongodb');

module.exports = req => {
    const { id } = query(req);

    if (!id || !ObjectId.isValid(id)) throw new Error();
    return { id };
};
