var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util');

var messageSchema = new Schema({
    sender: {type: String},
	recipient: {type: String},
    message: {type: String},
    date_created : {type: Date, default: new Date()}
});

module.exports = mongoose.model('message', messageSchema);