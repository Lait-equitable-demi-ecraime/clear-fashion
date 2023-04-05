const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');

const MONGODB_URI = 'mongodb+srv://charles:charles1@clearfashion.ps7zqbe.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';

async function ConnectMongoDb() {
    console.log('Connecting to MongoDB...');
    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection(MONGODB_COLLECTION);
    return { client, collection };
}

async function InsertProducts() {
    const { client, collection } = await ConnectMongoDb();
    try {
        console.log('Inserting products to MongoDB');

        const data_dedicatedbrand = JSON.parse(fs.readFileSync('data_dedicatedbrand.json'));
        const data_montlimart = JSON.parse(fs.readFileSync('data_montlimart.json'));
        const data_circlesportswear = JSON.parse(fs.readFileSync('data_circlesportswear.json'));

        const inserted_data_dedicatedbrand = await collection.insertMany(data_dedicatedbrand);
        console.log(inserted_data_dedicatedbrand);

        const inserted_data_montlimart = await collection.insertMany(data_montlimart);
        console.log(inserted_data_montlimart);

        const inserted_data_circlesportswear = await collection.insertMany(data_circlesportswear);
        console.log(inserted_data_circlesportswear);

        console.log('Products inserted successfully.');
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

InsertProducts();


async function ByBrand() {
    await ConnectMongoDb();
    console.log('Fetching products from same brand...');
    const brand = 'Dedicated';
    const products = await collection.find({"brand" : brand}).toArray();
    return products;
}

async function LessThanPrice() {
    await ConnectMongoDb();
    console.log('Fetching products less than a selected price...');
    const price = 10;
    const products = await collection.find({"price": {$lt:price}}).toArray();
    console.log(products);
    process.exit(0);
}

async function fSortedByPrice() {
    await ConnectMongoDb();
    console.log('Fetching products sorted by price...');
    const products = await collection.find().sort({price: 34}).toArray();
    console.log(products);
    process.exit(0);
}

async function fSortedByDate() {
    await ConnectMongoDb();
    console.log('Fetching products sorted by date...');
    const products = await collection.find().sort({date: -1}).toArray();
    console.log(products);
    process.exit(0);
}
