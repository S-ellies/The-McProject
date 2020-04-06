var express = require('express');
var router = express.Router();
var User = require('../models/userModel')
var jwt = require('jsonwebtoken');

/**
 * Adds users to our database
 */
router.post('/register', function (req, res, next) {
  var username = req.body.user_name;
  var email = req.body.email;
  var password = req.body.password;
  var instrument = req.body.instrument;
  // Check if account already exists
  User.findOne({ 'user_name': username, 'email':email}, function (err, user) {
    if (err)
      res.send(err);
    // check to see if theres already a user with that email
    if (user) {
      res.status(401).json({
        "status": "info",
        "body": "Username or e-mail address already taken"
      });
    } else {
      // If there is no user with that username create the user
      var newUser = new User();
      // set the user's local credentials
      newUser.user_name = username;
      newUser.email = email;
      newUser.instrument = instrument;
      newUser.password = newUser.generateHash(password);
      newUser.access_token = createJwt({ user_name: username });
      newUser.save(function (err, user) {
        if (err)
          throw err;
        res.cookie('Authorization', 'Bearer ' + user.access_token);
        res.json({ 'success': 'account created' });
      });
    }
  });
});
/**
 * Retrieve register page
 */
router.get('/register', function(req, res, next) {
  res.render('register');
});
/**
 * Retrieve page to setup profile after registering
 */
router.get('/profileSetup', function(req, res, next) {
  res.render('profileSetup');
});
/**
 * Retrieve login page
 */
router.get('/login', function(req, res, next) {
  res.render('login');
});


/**
 * Updates existing user information
 * !!!!!!!!!!!!!!!UNFINISHED
 */
router.put('/updateUser', function (req, res, next) {
  User.find({ _id: req.query._id }, function (err, users) {
    if (err)
      throw err;
    if(req.instrument != null)
      users.instrument.push(req.instrument);
    if(req.user_name != null)
      users.user_name = req.user_name;
  })
});
/**
 * login api
 */
router.post('/login', function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({ 'email': email }, function (err, user) {
    // if there are any errors, return the error
    if (err)
      res.send(err);
    // If user account found then check the password
    if (user) {
      // Compare passwords
      if (user.validPassword(password)) {
        // Success : Assign new access token for the session
        user.access_token = createJwt({ email: email });
        user.save();
        res.cookie('Authorization', 'Bearer ' + user.access_token);
        res.json({ 'success': 'loggedIn' });
      }
      else {
        res.status(401).send({
          "status": "error",
          "body": "Email or password does not match"
        });
      }
    }
    else {
      res.status(401).send({
        "status": "error",
        "body": "Username not found"
      });
    }
  });
});
/**
 * Retrieve user JSON from out database
 */
router.get('/getUsers', function (req, res, next) {
  if (req.query.user_name != null && req.query.instrument != null) {
    User.find({ user_name: req.query.user_name }, function (err, users) {
      if (err)
        throw err;
      res.json(users);
    })
  } else if (req.query.user_name != null) {
    User.find({ user_name: req.query.user_name }, function (err, users) {
      if (err)
        throw err;
      res.json(users);
    })
  } else if (req.query.instrument != null) {
    User.find({ instrument: req.query.instrument }, function (err, users) {
      if (err)
        throw err;
      res.json(users);
    })
  } else {
    User.find({}, function (err, users) {
      if (err)
        throw (err);
      res.json(users);
    })
  }
});
/*
 *Creates a JWT
 */
function createJwt(profile) {
  return jwt.sign(profile, 'CSIsTheWorst', {
    expiresIn: '10d'
  });
}
/**
 * Verifies JWT
 */
function verifyJwt(jwtString) {

  var value = jwt.verify(jwtString, 'CSIsTheWorst');
  return value;
}


module.exports = router;
