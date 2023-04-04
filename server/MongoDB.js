const {MongoClient, ObjectId} = require('mongodb');
var MONGODB_URI = 'mongodb+srv://charles:charles@clearfashioncluster.ed8xkyr.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion_db';
const MONGODB_COLLECTION = 'clearfashion_collection';
const fs = require('fs');
var collection = null;

async function connectMongoDb(){
    console.log('Connecting to MongoDB ...');
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    collection = db.collection(MONGODB_COLLECTION);
}