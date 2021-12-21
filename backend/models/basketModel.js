const mongoose = require('mongoose');
const { Schema } = mongoose;


const basketSchema = new Schema({
    id_user: {type: Schema.Types.ObjectId, ref: 'user'},
    products: [{id_product: {type: Schema.Types.ObjectId, ref: 'Product'}, count: Number}]
},
{ collection: 'basket' });

const BasketModel = mongoose.model('Basket', basketSchema);

module.exports = BasketModel;