const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const favouriteSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    productId: {type: Schema.Types.ObjectId, ref: 'Product'}
});

const FavouriteModel = mongoose.model('Favourite', favouriteSchema);

module.exports = FavouriteModel;