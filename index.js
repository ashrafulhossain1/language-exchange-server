const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:5173',
        'https://language--exchange-a-11.web.app',
        'https://language--exchange-a-11.firebaseapp.com'
    ],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser());



const verifyToken = (req, res, next) => {
    const token = req.cookies?.token
    // console.log('inside from verify token', token)
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }
    // verify token
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized Access' })
        }
        req.user = decoded;

        next();
    })


}



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
        const bookedCollection = client.db('languageExchange').collection('booked')
        const usersCollection = client.db('languageExchange').collection('users')

        // ####################JWT
        // Auth related API -- login time (add cookie) =================================================
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: '5h' })
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                })
                .send({ success: true })
        })


        app.post('/logout', (req, res) => {
            res
                .clearCookie('token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                })
                .send({ success: true })


        })







        // TUTORS RELATED APIS  
        // get all tutors 
        // PAGE=> find-tutor
        // PAGE=> find-tutor/:category

        app.get('/tutors', async (req, res) => {
            const { category, search } = req.query;

            let query = {};
            if (category) {
                query.language = category;
            } else if (search) {
                query.language = { $regex: search, $options: 'i' };
            }

            const cursor = tutorialCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })


        // my tutorials (private)
        app.get('/tutors/:email', async (req, res) => {
            const email = req.params.email;
            const query = { tutorEmail: email }
            const cursor = tutorialCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        // get specific one tutorial (private for details page)
        app.get('/tutor/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await tutorialCollection.findOne(query)
            res.send(result)
        })


        // add tutorials (private)
        app.post('/add-tutorials', async (req, res) => {
            const newTutorial = req.body;
            const result = await tutorialCollection.insertOne(newTutorial)
            res.send(result)
        })

        app.put('/updateTutorial/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('updating hitting', id)
            const query = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updated = {
                $set: req.body
            }
            const result = await tutorialCollection.updateOne(query, updated, option)
            res.send(result)
        })


        // delete tutorials (private)
        app.delete('/delete-tutor/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await tutorialCollection.deleteOne(query)
            res.send(result)
        })


        // BOOKED RELATED APIs

        // insert one book post
        app.post('/add-book', async (req, res) => {
            const singleBook = req.body;
            const result = await bookedCollection.insertOne(singleBook)
            res.send(result)
        })


        app.get('/myBooked/:email', verifyToken, async (req, res) => {
            const email = req.params.email
            const query = { userEmail: email }

            // console.log('cok cok ', req.cookies?.token)
            if (req.user.email !== req.params.email) {
                return res.status(403).send({ message: 'forbidden Access' })
            }


            const result = await bookedCollection.find(query).toArray()
            // aggregate data from tutorials collection 
            for (const book of result) {
                const filter = { _id: new ObjectId(book.tutorId) }
                const tutorial = await tutorialCollection.findOne(filter)
                // console.log('=======================================', tutorial)
                if (tutorial) {
                    book.tutorName = tutorial.tutorName;
                    book.image = tutorial.image;
                    book.language = tutorial.language;
                    book.tutorFee = tutorial.tutorFee;
                    book.review = tutorial.review;
                }
            }

            res.send(result)
        })

        // review count inc operator
        app.patch('/review/:tutorId', async (req, res) => {
            const tutorId = req.params.tutorId
            // console.log(tutorId)
            const query = { _id: new ObjectId(tutorId) }

            const updateReview = {
                $inc: { review: 1 }
            }
            const result = await tutorialCollection.updateOne(query, updateReview)
            // console.log(result)
            res.send(result)
        })

  
        //<========================= USERS RELATED APIs ========================>
        // ########TOTAL USERS
        // from email password signUp page
        app.post('/users', async (req, res) => {
            const userInfo = req.body
            // console.log("hitting from clint", userInfo)

            const result = await usersCollection.insertOne(userInfo);
            res.send(result);
        })



        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            if (user) {
                res.json(user);
            } else {
                res.json(null);
            }
        });

        // ######## TOTAL USERS
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send({ userCount: result.length });
        });

        // ######### TOTAL TUTORS
        app.get('/tutorCount', async (req, res) => {
            const tutorCount = await tutorialCollection.estimatedDocumentCount();
            res.send({ tutorCount })
        })

        // ######## review Count

        app.get('/reviewsCount', async (req, res) => {
            const result = await tutorialCollection.aggregate([
                {
                    $group: {
                        _id: null,
                        totalReviews: { $sum: "$review" }
                    }
                }
            ]).toArray()
            const reviewCount = result[0] ? result[0].totalReviews : 0;
            res.send({ reviewCount })
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
    // console.log('Language server is running: ', port)
})
