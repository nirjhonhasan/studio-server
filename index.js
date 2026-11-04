import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb';

import 'dotenv/config';
const app = express();
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000;



const client = new MongoClient(process.env.MONGO_DB_URI)

const db = client.db("studio_tech_2026");
const myColl = db.collection("studios");

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB()



//frist API
app.get('/', (req, res)=>{
    res.send(`Hi, This is studio server`)
})









app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`);
})




