const express = require('express');
const cors = require('cors');
const app = express();
const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());
//app.use(cookieParser());


//console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.moucvko.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const assignmentCollection = client.db('studyMate').collection('allAssignment');
    const submittedCollection = client.db('studyMate').collection('allsubmitted');



    //get add submitted assignment
    app.post('/allsubmitted', async (req, res) => {
      const newSubmit = req.body;
      console.log(newSubmit);
      const result = await submittedCollection.insertOne(newSubmit);
      res.send(result);

    })

    //// Show all submitted product
    app.get('/allsubmitted', async (req, res) => {
      const cursor = submittedCollection.find();
      const result = await cursor.toArray();
      res.json(result); 
    })


     //all asingment show in 5000
    app.get('/allAssignment', async (req, res) => {
      const cursor = assignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //get create assignment
    app.post('/allAssignment', async (req, res) => {
      const newAssignment = req.body;
      console.log(newAssignment);
      const result = await assignmentCollection.insertOne(newAssignment);
      res.send(result);
    })

    //find assignment for update 
    app.get('/allAssignment/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await assignmentCollection.findOne(query);
      res.send(result);
    })
   
    //update
    app.put('/allAssignment/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedAssignment = req.body;
      const assignment = {
        $set: {
          title: updatedAssignment.title,
          description: updatedAssignment.description,
          marks: updatedAssignment. marks,
          thumbnailUrl:updatedAssignment.thumbnailUrl,
          difficulty: updatedAssignment.difficulty,
          dueDate: updatedAssignment.dueDate,
          image: updatedAssignment.image
        }
      }
      const result = await assignmentCollection.updateOne(filter, assignment, options);
      res.send(result);
    })

    //delete from all assignment
    app.delete('/allAssignment/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await assignmentCollection.deleteOne(query);
      res.send(result);
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);


app.get('/', ( req, res ) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})