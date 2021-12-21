const BasketModel = require("../models/basketModel");
const ProductModel = require("../models/productModel");
const mongoose = require ('mongoose');
const orderController = require("./orderController");
const ObjectId = mongoose.Types.ObjectId;

class BasketController{
    async getUserBasket(req){
        try {
            const id_user = req;

            const basket = await BasketModel.findOne({id_user: id_user}).populate('products.id_product');

            return basket;
        } catch(e) {
            console.log(e);
            return  'Connot get baskets' ;
        }
    }

    async createBasket(req, res){
        try {
            const basket = await BasketModel.create({id_user: req, products:[]});
            return ;
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot create basket' });
        }
    }

    async updateBasket(req, res) {
        try {
            let { id_product, count } = req.body;

            let result = await BasketModel.findOne({id_user: req.session.user_token});
            let prod = result.products;
            for (let i=0; i<prod.length; i++){
                if (prod[i].id_product.equals(ObjectId(id_product))){
                    prod[i].count = count;
                }
            }
            result.save();
            return res.redirect('/cart');
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot update basket' });
        }
    }

    async addBasket(req, res){
        try {
            let {id_product} = req.body;
            let result = await BasketModel.findOne({id_user: req.session.user_token});
            let prod = result.products;
            let l = 0;

            for (let i=0; i<prod.length; i++){
                if (prod[i].id_product.equals(id_product)){
                    prod[i].count ++;
                    l = 1;
                }
            }
            if( l == 0){
                prod.push({id_product: {...(await ProductModel.findOne({_id: id_product}))._doc}, count: 1})
            }
            result.save();
            return res.redirect('/cart');
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot add element' });
        }
    }

    async deleteBasket(req,res){
        try {
            let result = await BasketModel.findOne({id_user: req.session.user_token});

            let order = {userId: req.session.user_token, products: result.products,...req.body}

            await orderController.createOrder(order);

            result.products = [];
            await result.save();
            
            return res.redirect('/thanks');
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot delete basket' });
        }
    }

    async deleteElBasket(req, res){
        try {
            let {id_product} = req.body;
            let result = await BasketModel.findOne({id_user: req.session.user_token});
            let prod = result.products;

            for (let i=0; i<prod.length; i++){
                if (prod[i].id_product.equals(id_product)){
                    prod.splice(i,1);
                }
            }
            result.save();
            return res.redirect('/cart');
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot delete element' });
        }
    }

}

module.exports = new BasketController();