const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require("cors")
require('dotenv').config()



app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ra0tvnn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const toyCollections = client.db("toyCollections").collection("AllToysData");

        app.get("/allToysDatas", async (req, res) => {
            const result = await toyCollections.find().toArray();
            res.send(result)
        })

        app.get("/categoryToyData", async (req, res) => {
            const name = req.query.name;
            const SubCategoryData = await toyCollections.find({ "Sub_category": { $regex: name } }).toArray();
            res.send(SubCategoryData);
        });

        app.get("/allToysDatasName", async (req, res) => {
            const toyName = req.query.toyName;
            const searchToy = await toyCollections.find({ "toy_name": { $regex: toyName } }).toArray();
            res.send(searchToy);
        });


        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})