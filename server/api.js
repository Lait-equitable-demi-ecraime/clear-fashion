const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const MongoClient = require('mongodb').MongoClient;

const PORT = 8092;
const MONGODB_URI = 'mongodb+srv://charles:charles1@clearfashion.ps7zqbe.mongodb.net/?retryWrites=true&w=majority'; // replace this with your MongoDB Atlas URI
const DB_NAME = 'clearfashion'; // replace this with your database name

const app = express();

module.exports = app;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  // connect to the database
  MongoClient.connect(MONGODB_URI, function(err, client) {
    if (err) {
      console.error('Failed to connect to the database:', err);
      return response.status(500).send('Failed to connect to the database');
    }

    const db = client.db(DB_NAME);
    const productsCollection = db.collection('products');

    // retrieve the products from the database
    productsCollection.find({}).toArray(function(err, products) {
      if (err) {
        console.error('Failed to retrieve products:', err);
        return response.status(500).send('Failed to retrieve products');
      }

      // send the products as the response
      response.send(products);

      // close the database connection
      client.close();
    });
  });
});

app.listen(process.env.PORT || 3000, () => console.log(`Server started on port ${process.env.PORT || 3000}`));

console.log(`📡 Running on port ${PORT}`);
