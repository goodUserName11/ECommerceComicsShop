const mongoose = require ('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');

const ProductController = require('./productController');
const UserController = require('./userController');



class OrderController {
    async getUserOrders(req) {
        try {
            const userId = req.session.user_token;
            
            const orders = await OrderModel.find({userId: userId}).populate('userId').populate('products.productId');
            return orders;
        } catch(e) {
            console.log(e);
            return { message: 'Connot get orders' };
        }
    }

    async getAllOrders() {
        try {
            const orders = await OrderModel.find().populate('userId').populate('products.productId');
            return orders;
        } catch(e) {
            console.log(e);
            return { message: 'Connot get orders' };
        }
    }

    // async deleteOrder(req, res){
    //     try {
    //         const {userId} = req.body;
    //         const result = await OrderModel.deleteOne({userId: userId});
    //         return res.json(result);
    //     } catch(e) {
    //         console.log(e);
    //         return res.status(500).json({ message: 'Connot delete order' });
    //     }
    // }

    async createOrder(req, res){
        try {
            let {userId, products, deliveryCost, adress, city, country, index} = req;

            let productsSum = 0;

            const allProducts = await ProductModel.find();
            let finalProducts = [];

            for(let i = 0; i < products.length; i++){
                productsSum = (allProducts.find(product => product._id.equals(products[i].id_product)).price*products[i].count);
            
                finalProducts.push({...products[i]._doc, productId: products[i].id_product});
            }

            await ProductController.deleteProductItems(products);


            console.log(finalProducts);

            const result = await OrderModel.create({userId: userId, products: finalProducts, 
                deliveryCost: deliveryCost, sum: productsSum, 
                date: new Date(), status: 'Сборка', adress: adress, city: city, 
                country: country, index: index});
            return;
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot create order' });
        }
    }

    async updateOrder(req, res){
        try {
            let admin, user;

            if (!req.session || !req.session.user_token) {
                res.redirect('/login');
                return;
            }

            user = true;
            admin = (await UserController.getOneUser(req.session.user_token)).isAdmin;

            if (!admin) {
                res.redirect('/');
                return;
            }

            const {_id, status} = req.body;

            const result = await OrderModel.updateOne({_id: _id}, {$set: {status: status}});
            return res.redirect('/adminBuys');
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot update orders' });
        }
    }

    async filterOrders(req, res){
        try {
            const {totalSum, date, status} = res.body;

            let orders

            if(totalSum && status){
                orders = await OrderModel.find().sort(
                    {totalSum: Number(totalSum), status: Number(status), date: Number(date)});
            }
            else if(totalSum && !status){
                orders = await OrderModel.find().sort(
                    {totalSum: Number(totalSum), date: Number(date)});
            }
            else if(!totalSum && status){
                orders = await OrderModel.find().sort(
                    {status: Number(status), date: Number(date)});
            }
            else if(!totalSum && !status){
                orders = await OrderModel.find().sort(
                    {date: Number(date)});
            }

            return res.json(orders);
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot get/filter orders' });
        }
    }
}



module.exports = new OrderController()