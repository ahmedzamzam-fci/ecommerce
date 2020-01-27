const mongoose = require('mongoose');

const itemsSchema = mongoose.Schema({

    name: { type: String, require: true },
    desc: { type: String, require: false },
    image: { type: String, require: true },
    subcatid: { type: String, require: true },
    price: { type: String, require: true }
});
module.exports = mongoose.model('Item', itemsSchema);
