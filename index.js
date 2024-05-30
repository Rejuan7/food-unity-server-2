
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@rejuanahmmed.kijwvcr.mongodb.net/?retryWrites=true&w=majority&appName=rejuanahmmed`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const foodCollection = client.db("foodUnityDB").collection("food");

    app.get("/food", async (req, res) => {
      // const cursor = foodCollection.find();
      // const result = await cursor.toArray();
      const name = req.query.name;
      const query = { foodStatus: "Available" };
    
      let result;
      if (name) {
        const regex = new RegExp(name, "i");
        query.foodName = { $regex: regex };
        result = await foodCollection.find(query).toArray();
      } else {
        result = await foodCollection.find(query).toArray();
      }

      res.send(result);
    });

    app.get("/allFood",async(req ,res)=>{
          const result=await  foodCollection.find().toArray()
          res.send(result)
    })

    app.get("/food/:email", async (req, res) => {
     
       const email = req.params.email
     

      const result = await foodCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.get("/featureFood", async (req, res) => {
      const result = await foodCollection
        .find({ foodStatus: "Available" })
        .sort({ foodQuantity: -1 })
        .limit(6)
        .toArray();

      res.send(result);
    });
    // app.get("/myFood", async (req, res) => {
    //   const query = { foodStatus: "myFood" };
    //   const result = await foodCollection.find(query).toArray();
    //   res.send(result);
    // });
    app.get("/myFood/:email", async (req, res) => {
      const query = { foodStatus: "myFood", newEmail: req?.params?.email };
      const result = await foodCollection.find(query).toArray();
      res.send(result);
    });
    

    app.put("/myFood/:id", async (req, res) => {
      try {
        const id = req.params.id;
             const {myEmail}=req.body
        const filter = { _id:  new ObjectId(id) };
        const options = { upsert: true };
          
        const currentDate = new Date().toISOString().split("T")[0];

        const updatedFields = {
          $set: {
            foodStatus: "myFood",
           currentDate: currentDate,
            newEmail : myEmail
          },
        };

        const result = await foodCollection.updateOne(
           filter,
          updatedFields,
          options
        );
        console.log(result)

        res.send(result);
      } catch (error) {
        console.error("Error updating craft:", error);
        res.status(500).send("Error updating craft");
      }
    });


      // sdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf

      app.put('/editFood/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateFood = req.body;
            const   {
              foodName,
              foodImage,
              foodQuantity,
              pickupLocation,
              expire,
              notes,
            
            }=updateFood


          
            
            const updatedFields = {
                $set: {
                  foodName: foodName,
                  foodImage: foodImage,
                  fodQuantity: foodQuantity,
              pickupLocation :pickupLocation,
              expire: expire,
              notes: notes

                }
            };
    
            const result = await foodCollection.updateOne(filter, updatedFields, options);
            res.send(result);
        } catch (error) {
            console.error("Error updating craft:", error);
            res.status(500).send("Error updating craft");
        }
    });

        

      // sfdddddddddddddddd

    app.post("/food", async (req, res) => {
      const newFood = req.body;
      const result = await foodCollection.insertOne(newFood);
      res.send(result);
    });

    app.delete("/deleteFood/:id", async (req, res) => {
      const id = req.params.id;
     
      const query = { _id:  new  ObjectId(id) };
      const result = await foodCollection.deleteOne(query);
     
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Food Unity server is running");
});

app.listen(port, () => {
  console.log(`Food Unity server is running on port ${port}`);
});
