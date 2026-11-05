import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';

import 'dotenv/config';
const app = express();
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000;

const client = new MongoClient(process.env.MONGO_DB_URI)

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}
const connectClinet = await connectToMongoDB()
const db = connectClinet.db("studio_tech_2026");
const studiosData = db.collection("studios");
const myBookinsData = db.collection("my-bookings-data")


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).send({ msg: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send({ msg: "Unauthorized token" });
    }

    next();
}



app.get('/studios/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const studio = await studiosData.findOne({ _id: new ObjectId(id) })
    console.log(studio);
    res.send(studio)
})

app.post('/studios',verifyToken, async (req, res) => {
    const postStudios = req.body;
    const result = await studiosData.insertOne(postStudios);
    res.send(result);
})

app.get('/studios', async (req, res) => {
    const result = await studiosData.find().toArray();
    res.send(result);
})


app.patch('/studios/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        
        delete updatedData._id;

        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: updatedData
        };

        const UpdateStudio = await studiosData.updateOne(filter, updateDoc);
        console.log("Update Result:", UpdateStudio);
        res.send(UpdateStudio);
    } catch (error) {
        console.error("CRITICAL PATCH ERROR:", error); 
        res.status(500).send({ error: error.message });
    }
});


app.delete('/studios/:id', verifyToken, async (req, res) => {

        const id = req.params.id;
        console.log("Deleting ID:", id); 
        
        const result = await studiosData.deleteOne({ _id: new ObjectId(id) });
        res.send(result);

});

app.get('/categories', async (req, res) => {
    const categories = await studiosData.distinct("category");
    res.json(categories);
});




app.post('/my-set-studios', verifyToken, async (req, res) => {
    const bookingData = req.body;
    const result = await myBookinsData.insertOne(bookingData);
    res.send(result);
    console.log(result);
})

app.get('/my-set-studios', verifyToken, async (req, res) => {
    const result = await myBookinsData.find().toArray();
    res.send(result);
})



app.get('/my-listings/:email', verifyToken, async (req, res) => {
    const email = req.params.email;
    const query = { userEmail: email };

    const result = await myBookinsData.find(query).toArray();
    res.send(result);
});






app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})