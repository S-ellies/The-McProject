var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
require('./util');

var usersSchema = new Schema({
    user_name: { type: String, require: true },
    instrument: { type: [String], require: true },
    email: { type: String, require: true },
    location: { type: String, require: true },
    dob: { type: Date, require: true },
    image: { type: String },
    bio: { type: String },
    password: { type: String, require: true },
    access_token: String
});

/*
 * Hashes the password for storage in the DB
 */
usersSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// Compares passwords to determine if the user is who they say they are
usersSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', usersSchema);