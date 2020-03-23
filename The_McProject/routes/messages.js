var express = require('express');
var router = express.Router();
var Message = require('../models/messageModel');

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

/* GET messages */
router.get('/getMessages', function(req, res, next) {

    Message.find({}, function (err, messages) {
        if (err)
            res.send(err);

        res.json(messages);
    });
});

/*GET messages for current user -- need to change hardcoded "Morf" to variable with logged in username*/
router.get('/getUserMessages', function(req, res, next) {
    Message.find({ $or: [{sender: "Morf"}, {recipient: "Morf"}]}, function (err, messages) {
        if (err)
            res.send(err);

        res.json(messages);
    });
});

/* DELETE message */
router.delete('/removeMessage/:id', function(req, res, next){

    var id = req.params.id;
    Message.deleteOne({_id:id}, function (err) {
        if (err)
            res.send(err);

        res.json({status : "Successfully removed the document"});
    });
});

module.exports = router;