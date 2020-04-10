var express = require('express');
var router = express.Router();
const User = require('../models/userModel');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/*GET profile setup page */
router.get('/profileSetup',function(req,res,next) {
  res.render('profileSetup', {title: 'profileSetup'});
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

/**
 * GET user profile picture
 */
router.get('/getUserImage', function (req, res, next) {
    User.findOne({access_token: req.cookies.Authorization.split(" ")[1]}, function (err, user) {
        if (err)
            throw err;
        res.json(user.image);
    })
})

/*GET profile */
router.get('/profile',function (req,res,next) {
    router.get('profile', {title : "sample profile"});
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

