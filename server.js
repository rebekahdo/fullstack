const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://rgm:1eCs2Gzy6pE90ObT@cluster0.j66yeer.mongodb.net/?retryWrites=true&w=majority';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('todos')
    const todosCollection = db.collection('todos')
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use("/styles",express.static(__dirname + "/styles"));

    app.listen(3000, function() {
        console.log('listening on 3000')
    })

    app.get('/', (req, res) => {
        db.collection('todos').find().toArray()
          .then(results => {
            console.log(results)
            res.render('index.ejs', { todos: results })
          })
          .catch(error => console.error(error))
      })

    app.post('/todos', (req, res) => {
        todosCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/')
          })
          .catch(error => console.error(error))
      })
  })
