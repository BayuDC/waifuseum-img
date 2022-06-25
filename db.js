const { MongoClient } = require('mongodb');

const url = process.env.DB_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

client.connect().then(() => {
    console.log('mongo: Connected to database');
});

module.exports = client.db(process.env.DB_NAME || 'waifuseum');
