const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()


//meddle ware
app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mn62n.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('taskManagement').collection('tasks');
        console.log('db connected')

        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })
        //add task
        app.post('/addTask', async (req, res) => {
            const newTask = req.body
            const result = await taskCollection.insertOne(newTask)
            res.send(result)
        })

        // Delete task
        app.delete('/tasks/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id: ObjectId(id)};
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })


    }
    finally {

    }

}
run().catch(console.dir)

//Get  
app.get('/', (req, res) => {
    res.send('running genuse server')
})

//Listen Port
app.listen(port, () => {
    console.log('lising the port', port)
})

