const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({

    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    type: { type: String, require: true }

});
module.exports = mongoose.model('User', usersSchema);
