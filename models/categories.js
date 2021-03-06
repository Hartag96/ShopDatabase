const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String
    },
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]

})

module.exports = mongoose.model('Category', categorySchema);
