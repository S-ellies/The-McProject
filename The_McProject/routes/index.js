var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/*GET messages page. */
router.get('/messages', function(req, res, next) {
    res.render('messages', {title: 'Messages'});
});

module.exports = router;

