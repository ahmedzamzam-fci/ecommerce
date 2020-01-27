const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({

    name: { type: String, require: true },
    desc: { type: String, require: false },
    catid:{ type: String, require: true },
    image:{ type: String, require: true }

});
module.exports = mongoose.model('SubCategory', subCategorySchema);
