var express = require('express');
var router = express.Router();
var Message = require('../models/messageModel');
var User = require('../models/userModel');
const { check, validationResult } = require('express-validator');

/* POST message to db */
router.post('/addMessage', [check("message").notEmpty(), check("message").escape()], function(req, res, next) {
    // Extract the request body which contains the messages
    const message = new Message(req.body);
    message.save(function (err, savedMessage) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.mapped());
            console.log("errors");
            return res.status(422).json({ errors: errors.array() });
        }

        if (err)
            throw err;

        res.json({
            "id": savedMessage._id
        });
    });
});

/* POST conversation when user starts new conversation */
// router.put('/newConversation', function (req, res, next) {
//     Conversations.updateOne({user: req.user}, $push {req.newUser}, function(err, conversation) {
//
//     })
// })

/* GET messages for current user */
router.get('/getUserMessages', function(req, res, next) {
    var jwtString = req.cookies.Authorization.split(" ");
    User.findOne( {access_token: jwtString}, function (err, user) {
        Message.find({ $or: [{sender: user.user_name}, {recipient: user.user_name}]}, function (err, messages) {
            if (err)
                res.send(err);

            res.json(messages);
        }).sort( { date_created: -1 } );
    });
});

/* DELETE message */
router.delete('/removeMessage/:id', function(req, res, next) {

    var id = req.params.id;
    Message.deleteOne({_id:id}, function (err) {
        if (err)
            res.send(err);

        res.json({status : "Successfully removed the document"});
    });
});

module.exports = router;