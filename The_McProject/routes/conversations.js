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
    conversation.last_altered = new Date(Date.now());
    conversation.messages[0].date_created = new Date(Date.now());
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
router.put('/sendMessage', function (req, res, next) {
    const message = {
        "sent_by": req.body.sent_by,
        "message": req.body.message,
        "date_created": new Date(Date.now())
    }
    Conversation.findOneAndUpdate({_id: req.body.conversation_id}, {$push: {messages: message }, $set: {last_altered: new Date(Date.now())}}, function (err, conversation) {
        if (err)
            throw err;
        res.json("success");
    });
});

/**
 *  GET conversation by id and populate user objects
 */
router.get('/getConversation/:id', function (req, res, next) {
    Conversation.findOne({_id: req.params.id}).populate('users').exec( function (err, conversation) {
        if (err)
            throw err;

        res.json(conversation);
    });
});

router.get('getConversationID/user&friend', function (req, res, next) {
    Conversation.findOne({users: {$in: [req.params.user, req.params.friend]}}, function (err, conversation) {
        if (err)
            throw err;

        res.json(conversation._id);
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
        Conversation.find({users: user._id}).sort({last_altered: -1}).populate({path: 'users', select: 'user_name', model: 'User'}).exec( function (err, conversations) {
            if (err)
                throw err;

            var friend;
            var messages = [];
            for (var i = 0; i < conversations.length; i++) {
                if (conversations[i].users[0]._id.equals(user._id)) friend = conversations[i].users[1];
                else friend = conversations[i].users[0];
                messages.push({
                    friend: friend.user_name,
                    sent_by: conversations[i].messages[conversations[i].messages.length - 1].sent_by,
                    message: conversations[i].messages[conversations[i].messages.length - 1].message,
                    date_created: conversations[i].messages[conversations[i].messages.length - 1].date_created,
                    conversation_id: conversations[i]._id
                });

            }
            res.json(messages);
        });
    });
});

/**
 * GET user id for new conversation
 */
router.get('/getUserID/:name', function(req, res, next) {
    User.findOne({user_name: req.params.name}, function(err, user) {
        console.log(user);
        if (err)
            throw err;
        if (user == null)
            res.json("No user found");
        else res.json({
            _id: user._id,
            user_name: user.user_name
        });
    })
})


module.exports = router;

