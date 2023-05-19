const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        app.get("/allToysDatas/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollections.find(query).toArray()
            res.send(result)
        })
        // const options = {
        //     projection: { title: 1, img: 1, service_id: 1, price: 1 },
        //   };

        app.get("/updateRouteData/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = {
                projection: { price: 1, picture: 1, available_quantity: 1, detail_description: 1 }
            }
            const result = await toyCollections.find(query, options).toArray()
            res.send(result)
        })

        // update here from updated data route
        app.patch("/updateRouteData/:id", async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    price: data.price,
                    available_quantity: data.available_quantity,
                    detail_description: data.detail_description
                }
            }
            const result = await toyCollections.updateOne(query, updatedDoc)
            res.send(result)

        })

        app.get("/categoryToyData", async (req, res) => {
            const name = req.query.name;
            const SubCategoryData = await toyCollections.find({ "Sub_category": { $regex: name } }).toArray();
            res.send(SubCategoryData);
        });

        app.get("/allToysDatasName", async (req, res) => {
            const toyName = req.query.toyName;
            // console.log(toyName)
            // const newName = toyName.replace(/[^a-zA-Z0-9 ]/g, '');
            // console.log(newName)
            const searchToy = await toyCollections.find({ "toy_name": { $regex: toyName.replace(/[^a-zA-Z0-9 ]/g, '') } }).toArray();
            res.send(searchToy);
        });

        app.post("/allToysDatas", async (req, res) => {
            const data = req.body;
            const result = await toyCollections.insertOne(data)
            res.send(result)
        })

        app.get("/logedInUserDatas", async (req, res) => {
            const email = req.query.email;
            const result = await toyCollections.find({ "seller_email": { $regex: email } }).toArray();
            res.send(result);

        })
        app.delete('/allToysDatas/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollections.deleteOne(query)
            res.send(result);
        })


        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ====== ${port}`)
})