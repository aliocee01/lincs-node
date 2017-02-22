const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors')
const passport = require('passport')
const mongoose = require('mongoose')
const config = require('./config/database')

mongoose.connect(config.database)

mongoose.connection.on('connected', () =>{
  console.log('connected to database ' + config.database);
})
mongoose.connection.on('error', (error) =>{
  console.log('Database error ' + error);
})

const app = express()
const port = 3000
const api = require('./routes/api')

// CORS Middleware
app.use(cors())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Body Parser Middleware
app.use(bodyParser.json())

// Routes
app.get('/', (req, res) => {
  res.send('Welcome')
})

app.use('/api', api)

app.listen(port, () => {
  console.log('Running on port ' + port)
})
