const express = require('express');
const bodyParser = require('body-parser') //body te read korer jonno jate error na kahy
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; // ata korsi delet ar smy data ghular default id ta pete jeta amni amni creat hoy database a


const password = 'xHxjT6D37gnjtynO';

const uri = "mongodb+srv://organicUser:xHxjT6D37gnjtynO@cluster0.7adfu.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json()); //body te read korer jono korsi error jate na khay
app.use(bodyParser.urlencoded({ extended: false })) //ata korsi form take read korer jonno searh dibo bodyparder middleware submit then coypy krbo ayta

//5000 port a use korayte get use krosi
app.get('/',(req, res)=>{
  res.sendFile(__dirname + '/index.html')
})




client.connect(err => {
  const productCollection = client.db("organicdb").collection("produts");
 //database a index.heml ar form ar information ghula patahyte post use korsi

//akhane get die data read kora hoise
app.get("/products",(req, res)=>{
  productCollection.find({}) //.limit(2) dile limit korer jonno sob ghula data na dia just 2ta data dibe
  .toArray((err, documents)=>{
    res.send(documents) //product url router a sob ghula data database theke chole asabe
  })
})

//akhane get die data update kora hoise ui te
app.get("/product/:id",(req, res)=>{
  productCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err, documents)=>{
    res.send(documents[0]);
  })
})


  app.post("/addProduct",(req, res)=>{
   const product = req.body;
   productCollection.insertOne(product)//ata korsi ekdom databesea a data ta post mani creat krete
   .then(result =>{
      console.log('data added successfully');
      // res.send('successfully form filled up') //browser a success dhekabe
      res.redirect('/') //reload hoia same page a data dhekabe
   }) 
  })


  //akhane data update kora hoise mongoDb te
  app.patch('/update/:id',(req, res)=>{
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result =>{
      res.send(result.modifiedCount > 0) //update korle jate load hoia sathe sathe ui te dhekay
      // console.log(result);

    })
  })


  //ata delete korer jonno data ghula 
  app.delete('/delete/:id',(req, res)=>{
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
      res.send(result.deletedCount > 0) //deleted kore faka kora ui te
    })
  })
 
});


app.listen(5000);






















