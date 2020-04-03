const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Conversation = require('../models/conversationModel');
const { check, validationResult } = require('express-validator');

/**
 * start a new conversation
 **/
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

/**
 * add new conversation to user objects
 */
router.put('/updateConversations', function (req, res, next) {
    const conversation = req.body.conversation;
    const users = req.body.users;

    User.updateMany({_id: {$in : users}}, {$addToSet: {conversations: conversation}}, function (err, user) {
        res.json(user);
    });
});

/**
 *  send message to existing conversation
 */
router.put('/sendMessageToConversation', function (req, res, next) {
    const date = new Date(Date.now());
    const message = {
        "sent_by": req.body.message.sent_by,
        "message": req.body.message.message,
        "date_created": date
    }
    Conversation.findOneAndUpdate({users: req.body.users}, {$push: {messages: message }}, function (err, conversation) {
        if (err)
            throw err;
        res.json("success");
    });
});

/**
 *  GET conversation by user _id and populate user objects
 */
router.get('/getConversation', function (req, res, next) {
    Conversation.findOne({users:{ "$in" : ["5e874a2e0f620433ecedff5c"]} }).populate('users').exec( function (err, conversation) {
        if (err)
            throw err;

        res.json(conversation);
    });
});

/**
 *  GET all user conversations
 */
router.get('/getUserConversations', function (req, res, next) {
    User.findOne({_id: "5e87545fe857cb299c1fa20c"}).populate({path: 'conversations', model: 'Conversation', populate: {path: 'users', select: 'user_name', model: 'User'}}).exec( function(err, user) {
        if (err)
            throw err;

        var friend;
        var conversations = [];
        //populate conversations array with {friend, messages} objects
        for (conversation of user.conversations) {
            for (_user of conversation.users) {
                console.log(_user);
                if (_user._id != user._id) friend = _user.user_name;
            }
            conversations.push({"friend:" : friend, "messages": conversation.messages})
        }
        //return array of conversations
        res.json(conversations);
    });
});

/**
 * GET last message of each conversation
 */
router.get('/getRecentMessages', function (req, res, next) {
    var jwtString = req.cookies.Authorization.split(" ");
    User.findOne({access_token: jwtString}, function (err, user) {
        if (err)
            throw err;
        Conversation.find({users: user._id}, function (err, conversations) {
            if (err)
                throw err;
            var messages = [];
            for (conversation of conversations) {
                messages.push(conversation.messages[conversation.messages.length-1])
            }
            res.json(messages);
        });
    });
});



module.exports = router;

