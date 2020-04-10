const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

/**
 * GET user's friends
 */
router.get('/getUserFriends', function (req, res, next) {
    User.findOne({access_token: req.cookies.Authorization.split(" ")[1]}).populate('friends').exec(function (err, user) {
        res.json(user.friends);
    })
})

/**
 * add new friend
 */
router.put('/addFriend', function (req, res, next) {
    User.findOneAndUpdate({access_token: req.cookies.Authorization.split(" ")[1]}, {$addToSet: {friends: req.body.id}}, function (err, user) {
        User.findOneAndUpdate({_id: req.body.id}, {$addToSet: {friends: user._id}}, function (err, friend) {
            console.log();
            res.json("success");
        })
    })
})

module.exports = router;