var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env || 'postgres://jsb:test@localhost:5432/dictate';

/* HTML Files */
router.get('/', function(req, res) {
  res.sendFile(__dirname + 'index.html');
});

router.get('/login', function(req, res){
    res.sendFile(__dirname + '/login.html');
});

router.get('/main', function(req ,res){
    res.sendFile(__dirname + '/main.html')
});

/* JS Files */
router.get('/jquery', function(req, res){
   res.sendFile(__dirname + 'js/jquery-2.1.4.min.js');
});

router.get('/noty', function(req, res){
   res.sendFile(__dirname + 'js/jquery.noty.packaged.min.js');
});

router.get('/bootstrapjs', function(req, res){
    res.sendFile(__dirname + 'js/bootstrap.min.js');
});

router.get('/loginjs', function(req, res){
    res.sendFile(__dirname + 'js/login.js');
});

router.get('/sha', function(req, res){
    res.sendFile(__dirname + 'js/sha.js');
});

/* CSS Files */
router.get('/bootstrapcss',function(req, res){
    res.sendFile(__dirname + 'css/bootstrap.min.css');
});

router.get('/animate', function(req,res){
    res.sendFile(__dirname + 'css/Animate.css');
});

/* Ajax Calls */
router.post('/checkLogin', function(req, res){
    user = req.body.user;
    pass = req.body.pass;
    pg.connect(connectionString, function(err, client, done){
        if(err){
            console.error(err);
            done();
            res.sendStatus(503).end();
        } else {
            client.query("SELECT * FROM user WHERE username=" + user + ";", function(err, result){
                if(err || result.length == 0){
                    console.error(err);
                    done();
                    res.sendStatus(400).end();
                } else if(results[0].password !== pass || results[0].username !== user){
                    done();
                    res.send({checked: false}).end();
                } else {
                    done();
                    res.send({checked: true, id: result[0].id}).end();
                }
            });
        }
    });
});

module.exports = router;
