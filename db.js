const { MongoClient } = require('mongodb');

const dbUri = process.env.DB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'waifuseum';

const mongo = new MongoClient(dbUri);

mongo.connect().then(() => {
    console.log('Connected to database');
});

module.exports = mongo.db(dbName);
