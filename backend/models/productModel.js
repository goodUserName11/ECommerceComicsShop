const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const productSchema = new Schema({
    title: String,
    price: Number,
    pictures: [{type: String}],
    coverType: String,
    publisher: String,
    description: String,
    items: [{type: Schema.Types.ObjectId}]
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;