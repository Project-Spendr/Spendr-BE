require('dotenv').config({ path: 'MONBODB_PASSWORD' });

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://MaxLamb:process.env.MONGODB_PASSWORD@cluster0.vuptk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
