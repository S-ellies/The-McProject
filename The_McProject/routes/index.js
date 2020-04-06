var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/*GET messages page. */
router.get('/messages', function(req, res, next) {

    try {
        var jwtString = req.cookies.Authorization.split(" ");
        var profile = verifyJwt(jwtString[1]);
        if (profile) {
            res.render('messages', {title: 'Messages'});
        }
    }catch (err) {
        res.json({
            "status": "error",
            "body": [
                "You are not logged in."
            ]
        });
    }
});

/*
Verifies a JWT
*/
function verifyJwt(jwtString) {
    var value = jwt.verify(jwtString,
        'CSIsTheWorst');
    return value;
}

module.exports = router;

