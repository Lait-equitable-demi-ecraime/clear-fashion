const {MongoClient, ObjectId} = require('mongodb');
var MONGODB_URI = 'mongodb+srv://charles:charles1@clear-fashion.vvfza2l.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clear-fashion';
const MONGODB_COLLECTION = 'clear-fashion';
const fs = require('fs');
var collection = null;

async function connectMongoDb(){
    console.log('Connecting to MongoDB ...');
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    collection = db.collection(MONGODB_COLLECTION);

connectMongoDb()

}
async function insertProductsMongoDB() {
    await connectMongoDb();
    try {
        console.log('Inserting products to the MongoDB database');
    
        const products_to_insert_1 = JSON.parse(fs.readFileSync('products_file_1.json'));
        const products_to_insert_2 = JSON.parse(fs.readFileSync('products_file_2.json'));
        const products_to_insert_3 = JSON.parse(fs.readFileSync('products_file_3.json'));
    
        const collection = db.collection('products');
    
        const inserted_products_1 = await collection.insertMany(products_to_insert_1);
        console.log(inserted_products_1);
    
        const inserted_products_2 = await collection.insertMany(products_to_insert_2);
        console.log(inserted_products_2);
    
        const inserted_products_3 = await collection.insertMany(products_to_insert_3);
        console.log(inserted_products_3);
    
        console.log('Products inserted successfully.');
    } catch (err) {
        console.error(err);
        } finally {
            client.close();
            }
}


insertProductsMongoDB();

async function fetchProductsByBrand() {
    await connectMongoDb();
    console.log('Fetching products from same brand...');
    const brand = 'Dedicated';
    const products = await collection.find({"brand" : brand}).toArray();
    return products;
}

async function fetchProductByID() {
    await connectMongoDb();
    console.log('Fetching product by ID...');
    const productID = "640f3707b8266552d9bf5504";
    const products = await collection.find({ "_id": ObjectId(productID) }).toArray();
    console.log(products);
    process.exit(0);
}

async function fetchProductsSortedByPrice() {
    await connectMongoDb();
    console.log('Fetching products sorted by price...');
    const products = await collection.find().sort({price: 1}).toArray();
    console.log(products);
    process.exit(0);
}

async function fetchProductsSortedByDate() {
    await connectMongoDb();
    console.log('Fetching products sorted by date...');
    const products = await collection.find().sort({date: -1}).toArray();
    console.log(products);
    process.exit(0);
}
