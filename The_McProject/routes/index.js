var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*GET users page*/
router.get('/Users',function(req,res,next) {
  res.render('users',{title: 'Users'});
});

module.exports = router;
