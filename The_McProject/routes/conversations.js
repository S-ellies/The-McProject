const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Conversation = require('../models/conversationModel');
const { check, validationResult } = require('express-validator');

/* start a new conversation */
router.post('/newConversation', function (req, res, next) {
    const conversation = new Conversation(req.body);
    console.log(conversation);
    conversation.save(function (err, conversation) {
        if (err)
            throw err;

        res.json({
            "id": conversation._id
        });
    });
 });

/* add new conversation to user objects */
router.put('/updateConversations', function (req, res, next) {
    const conversation = req.body.conversation;
    const users = req.body.users;

    User.updateMany({_id: {$in : users}}, {$addToSet: {conversations: conversation}}, function (err, user) {
        res.json(user);
    });
});

/* GET conversation by user _id and populate user objects*/
router.get('/getConversation', function (req, res, next) {
    Conversation.findOne({users:{ "$in" : ["5e874a2e0f620433ecedff5c"]} }).populate('users').exec( function (err, conversation) {
        if (err)
            throw err;

        res.json(conversation);
    });
});

/* GET all user conversations */
router.get('/getUserConversations', function (req, res, next) {
    User.findOne({_id: "5e874a2e0f620433ecedff5c"}).populate('conversations').exec( function(err, user) {
        if (err)
            throw err;

        res.json(user.conversations);
    });
});

module.exports = router;

