const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    quantity: {
        type: Number,
        required: false
    },
    price1: {
        type: Currency,
        default: '0'
    },
    price2: {
        type: Currency,
        default: '0'
    },
    price3: {
        type: Currency,
        default: '0'
    },
    available: {
        type: Boolean,
        default: true
    },
    images: {
        type: Array,
        required: false
    }
});

let Products = mongoose.model('Product', productSchema);
module.exports = Products;
