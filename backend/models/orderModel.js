const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const orderSchema = new Schema({
    products: [{productId: {type: Schema.Types.ObjectId, ref: 'Product'}, count: Number}],
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    deliveryCost: Number,
    sum: Number,
    date: String,
    status: String,
    adress: String,
    city: String,
    country: String,
    index: String,
});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;