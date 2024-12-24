const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_USER}:${process.env.USER_PASS}@cluster0.jkfsd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        console.log("Pinged your deployment. You successfully connected to MongoDB!");



        // all collections
        const tutorialCollection = client.db('languageExchange').collection('tutorials')

        // get all tutors
        app.get('/find-tutors', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            let query = {}
            if (email) {
                query = { tutorEmail: email }
            }
            const cursor = tutorialCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        

        // get specific one tutorial 
        app.get('/find-tutor/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await tutorialCollection.findOne(query)
            res.send(result)
        })



        // add tutorials
        app.post('/add-tutorials', async (req, res) => {
            const newTutorial = req.body;
            const result = await tutorialCollection.insertOne(newTutorial)
            res.send(result)
        })







    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('LANGUAGE EXPRESS server Is ON')
})

app.listen(port, () => {
    console.log('Language server is running: ', port)
})
