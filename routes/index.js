var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://jsb:test@localhost:5432/dictate';

/* HTML Files */
router.get('/', function(req, res) {
  res.sendFile(__dirname + 'index.html');
});

router.get('/login', function(req, res){
    res.sendFile(__dirname + '/../public/login.html');
});

router.get('/main', function(req ,res){
    res.sendFile(__dirname + '/main.html');
});

router.get('/call', function(req, res){
    res.sendFile(__dirname + 'call.html');
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

router.post('/signup', function(req, res){
    user = req.body.user;
    pass = req.body.pass;
    pg.connect(connectionString, function(err, client, done){
        if(err){
            console.error(err);
            done()
            res.sendStatus(503).end();
        } else {
            client.query("INSERT INTO user(username, password) VALUES (" + user + ", " + pass + ");", function(err, result){
                if(err){
                    done();
                    res.send({checked: false}).end();
                } else {
                    done();
                    res.send({checked: true}).end();
                }
            });
        }
    });
});

module.exports = router;
