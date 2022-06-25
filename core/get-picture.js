const { ObjectId } = require('mongodb');
const db = require('../db');

module.exports = async id => {
    const picture = await db.collection('pictures').findOne({ _id: new ObjectId(id) }, { projection: { url: 1 } });

    if (!picture) throw new Error();
    return picture;
};
