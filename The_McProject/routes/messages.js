var express = require('express');
var router = express.Router();
var Message = require('../models/messageModel');
var User = require('../models/userModel');

/* POST message to db */
router.post('/addMessage', function(req, res, next) {
    // Extract the request body which contains the messages
    message = new Message(req.body);
    message.save(function (err, savedMessage) {

        if (err)
            throw err;

        res.json({
            "id": savedMessage._id
        });
    });
});

/*GET messages for current user */
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