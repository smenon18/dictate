var express = require('express');
var router = express.Router();

/* HTML Files */
router.get('/', function(req, res) {
  res.sendFile(__dirname + 'index.html');
});

router.get('/login', function(req, res){
    res.sendFile(__dirname + '/login.html');
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

/* CSS Files */
router.get('/bootstrapcss',function(req, res){
    res.sendFile(__dirname + 'css/bootstrap.min.css');
});

router.get('/animate', function(req,res){
    res.sendFile(__dirname + 'css/Animate.css');
});

module.exports = router;
