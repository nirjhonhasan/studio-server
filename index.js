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

const verifyAPI = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    console.log("Cookies from frontend:", req.headers.cookie);
    if(authHeader !== "user logged in"){
        return res.status(401).send({msg: "Unauthorized"})
    }
    
    next();
}



//frist API
app.get('/', (req, res) => {
    res.send(`Hi, This is studio server`)
})


//put data from studio collection -> API
//put data from studio collection -> API
app.post('/studios', async (req, res) => {
    //get data form client
    const postStudios = req.body;

    //put data to mongdb
    const result = await studiosData.insertOne(postStudios);

    res.send(result);
})

//get data from studio collection -> API
app.get('/studios', async (req, res) => {
    const result = await studiosData.find().toArray();
    res.send(result);
})


app.get('/studios/:id', verifyAPI, async (req, res) => {
    const id = req.params.id;
    const studio = await studiosData.findOne({
        _id: new ObjectId(id)
    })

    res.send(studio)
})



app.get('/categories', async (req, res) => {
    const categories = await studiosData.distinct("category");
    res.json(categories);

});









app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})




