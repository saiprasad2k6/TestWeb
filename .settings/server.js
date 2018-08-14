const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const morgan = require('morgan');
const renderer = require('nexrender').renderer;
var multer = require('multer');
const app = express();
const dbUser = require('./server/db-users');
const service=require('./server/service');
var request = require('request');
var fs = require('fs');


//Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

//For Nexrenderer
const router = require('./node_modules/nexrender/server/routers');


//Express will look into the Public Folder for all the Static Resources
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use('/api', router);
app.use('/api/service',service);

//Send all request to Angular
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

    

//Set Port
const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('Running on localhost :' + port));


