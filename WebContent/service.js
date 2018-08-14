const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const morgan = require('morgan');
const renderer = require('nexrender').renderer;
var multer = require('multer');
const dbUser = require('../server/db-users');
var request = require('request');
var fs = require('fs');
var mime = require('mime-types');


const aebinary = '/Applications/Adobe After Effects CC 2017/aerender';

function renderProjects() {
    return new Promise((resolve, reject) => {
        try {
            let opts = {};
            opts.host = 'localhost';
            opts.port = '3000';
            opts.aerender = aebinary;

            renderer.start(opts);
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname,'/assets/uploads'));
    },
    filename: function (req, file, callback) {
        callback(null, req.params.userId + '_' + file.fieldname + '_' + Date.now()+"."+mime.extension(file.mimetype));
    }
});

upload = multer({
    storage: Storage
});


router.get('/render', (req, res) => {
    renderProjects().then(() => {
        res.header('Content-Type', 'application/json');
        res.send(JSON.stringify({ code: 200, message: 'Sccess' }));
    }, (e) => {
        res.header('Content-Type', 'application/json');
        res.send(JSON.stringify({ code: 300, message: 'Error' + JSON.stringify(e) }));
    });
});

router.post('/uploadFile/:userId', upload.any(), (req, res) => {
    res.send(req.files);
});


router.post('/createProject/:userId', (req, res) => {
    var userId = req.params.userId;
    request.post('http://localhost:3000/api/projects/',
        { json: req.body.project },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = {};
                data.userId = userId;
                data.projectId = body.uid;
                data.userName=req.body.user.userName;
                data.createdAt = new Date;
                data.updatedAt = new Date;
                dbUser.create(data);
                res.send(JSON.stringify({ code: 200, message: 'Success', projectUid: body.uid, userId: userId ,userName:req.body.user.userName}));
            }
        }
    );
});

router.get('/getUser/:userId', (req, res) => {
    var userId = req.params.userId;
    dbUser.get(userId).then((user) => {
        console.log(user);
        res.send(JSON.stringify({ code: 200, message: 'Success',user:user[0]})); 
    }).catch((err)=>{
        res.send(JSON.stringify({ code: 400, message: 'Failue', }));
    });
});

/* router.get('/getUsers', (req, res) => {
    
    dbUser.get().then((response) => {
        res.send(JSON.stringify({ code: 200, message: 'Success',users:response[0]})); 
    }).catch((err)=>{
        res.send(JSON.stringify({ code: 400, message: 'Failue', }));
    });
}); */
router.get('/getVideo/:userId', (req, res) => {
    var userId = req.params.userId;
    dbUser.get(userId).then((user) => {
        var fileName = user[0].projectId + "_result.mov";
        var fileFullPath = path.join(__dirname, '../results', fileName).toString();

        const stat = fs.statSync(fileFullPath);
        const fileSize = stat.size
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/quicktime',
        }
        res.writeHead(200, head)
        fs.createReadStream(fileFullPath).pipe(res);

    }, (err) => {
        res.send(JSON.stringify({ code: 400, message: 'Failue', }));
    });
});

router.get('/hasVideo/:userId', (req, res) => {
    var userId = req.params.userId;
    dbUser.get(userId).then((user) => {
        var fileName = user[0].projectId + "_result.mov";
        var fileFullPath = path.join(__dirname, '../results', fileName).toString();

        const stat = fs.statSync(fileFullPath);
        const fileSize = stat.size

        if (fileSize > 0)
            res.send(JSON.stringify({ code: 200, message: 'Success', videoName: fileName }));
        else res.send(JSON.stringify({ code: 200, message: 'Success', videoName: '' }));

    }).catch(function (err) {
        res.send(JSON.stringify({ code: 400, message: 'Failue', detail: err }));
    });
});

 router.get('/getUsers', (req, res) => {
    dbUser.get().then((response) => {
        console.log(response);
            res.send(JSON.stringify({ code: 200, message: 'Success', users: response }));
    }).catch(function (err) {
        res.send(JSON.stringify({ code: 400, message: 'Failue', detail: err }));
    });
});

module.exports = router;