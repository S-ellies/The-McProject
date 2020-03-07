const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./utils');

const messageSchema = new Schema({
    sender: {type: String},
	recipient: {type: String},
    message: {type: String},
    date_created : {type: Date, default: new Date()}
});

module.exports = mongoose.model('message', messageSchema);