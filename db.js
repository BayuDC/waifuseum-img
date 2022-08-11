const { MongoClient } = require('mongodb');
const { createClient } = require('redis');

const dbUri = process.env.DB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'waifuseum';

const mongo = new MongoClient(dbUri);
const redis = createClient({
    url: process.env.REDIS,
});

mongo.connect().then(() => {
    console.log('Connected to mongo database');
});
redis.connect().then(() => {
    console.log('Connected to redis database');
});

module.exports = {
    mongo: mongo.db(dbName),
    redis,
};
