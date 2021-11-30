const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const userSchema = new Schema({
    name: String,
    surname: String,
    patronymic: String,
    email: String,
    phone: String,
    gender: String,
    password: String,
    isAdmin: Boolean,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;