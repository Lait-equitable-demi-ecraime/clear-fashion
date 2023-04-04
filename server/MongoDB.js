const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://charles:charles1@clearfashioncluster.ed8xkyr.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';

let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = module.exports.getDB = async () => {
    try {
    if (database) {
        console.log('💽  Already Connected');
        return database;
    }
    `mongodb+srv://charles:charles1@clearfashioncluster.ed8xkyr.mongodb.net/?retryWrites=true&w=majority`
    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    database = client.db(MONGODB_DB_NAME);

    console.log('💽  Connected');

    return database;
    } catch (error) {
    console.error('🚨 MongoClient.connect...', error);
    return null;
    }
};