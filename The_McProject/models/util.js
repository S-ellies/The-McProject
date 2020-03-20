var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://mongodb5165es:pe2val@danu7.it.nuigalway.ie:8717/mongodb5165', {useUnifiedTopology: true, useNewUrlParser: true});
exports.connection = connection;
var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://mongodb5165es:pe2val@danu7.it.nuigalway.ie:8717/mongodb5165');
exports.connection = connection;
