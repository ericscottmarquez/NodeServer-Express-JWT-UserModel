
//main starting point of the server
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
// set up mongodb
const mongoose = require('mongoose');


//DB SETUP == USE THE NEW URL PARSER
mongoose.connect('mongodb://localhost:auth/auth', { useNewUrlParser: true });

//app setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*'}));
router(app);




//server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server Listening On:', port);









