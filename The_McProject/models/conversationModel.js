const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./util');

const conversationSchema = new Schema({
    users : [{type: Schema.Types.ObjectId, ref : 'User'}],
    messages: [{
            sent_by: {type: String},
            message: {type: String},
            date_created: {type: Date, default: new Date(Date.now())}
    }]
});

module.exports = mongoose.model('Conversation', conversationSchema);