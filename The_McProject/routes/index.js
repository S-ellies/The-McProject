const express = require('express');
const router = express.Router();
const Message = require('../models/messages');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST message to db */
router.post('/addMessage', function(req, res, next) {
	// Extract the request body which contains the messages
    const message = new Message(req.body);
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

/*GET conversation between 2 users*/
router.get('/getConversation', function(req, res, next) {

    Message.find({sender:req.query.sender, recipient:req.query.recipient}, function (err, messages) {
        if (err)
            res.send(err);

        res.json(messages);
    }).sort( { date_created: -1 } );
});

/* DELETE message */
router.delete('/removeMessage/:id', function(req, res, next){

    const id = req.params.id;
    Message.deleteOne({_id:id}, function (err) {
        if (err)
            res.send(err);

        res.json({status : "Successfully removed the message"});
    });
});

module.exports = router;

