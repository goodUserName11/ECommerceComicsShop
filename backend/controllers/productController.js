const ProductModel = require('../models/productModel');
const mongoose = require('mongoose');

const UserController = require('./userController');

class OrderController {
    async getAllProducts() {
        try {
            const products = await ProductModel.find();
            return products;
        } catch(e) {
            console.log(e);
            return {errorMessage: 'Connot get products'};
        }
    }

    async getOneProduct(req){
        try {
            const { productId } = req.query;
            const product = await ProductModel.findOne({ _id: productId });
            return product;
        } catch(e) {
            console.log(e);
            return {errorMessage: 'Connot get product' };
        }
    }


    async getSomeProducts(req){
        try {
            const {productId, publisher} = req.query;
            
            let products= [];
            products.push(...(await ProductModel.find({ publisher: publisher})));

            for(let i=0;i<products.length;i++){
                if(products[i]._id.equals(productId)){ //!!!
                    products.splice(i,1);
                }
            }

            if(products.length > 4) products.splice(4); //!!!!
            return products;
        } catch(e) {
            console.log(e);
            return { message: 'Connot get some products' };
        }
    }

    async getSearchProducts(req, res){
        try {
            const {searchQuery} = req.query; 
            let products= [];
            products.push(...(await ProductModel.find({ title: { $regex: searchQuery, $options: 'i' } })));
            return res.json(products);
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot get some products' });
        }
    }

    async getFilterProducts(req){
        try {
            const {publisher, coverType, minPrice, maxPrice, searchQuery } = req.query;

            let products;


            if(publisher && !coverType && !minPrice && !maxPrice && !searchQuery){
                products = await ProductModel.find({ publisher: publisher});
            }
            else if(!publisher && !coverType && !minPrice && !maxPrice && searchQuery){
                products = await ProductModel.find({ title: { $regex: searchQuery, $options: 'i' } });
            }
            else if(publisher && !coverType && !minPrice && !maxPrice && searchQuery){
                products = await ProductModel.find({ publisher: publisher, title: { $regex: searchQuery, $options: 'i' } });
            }
            else if(!publisher && !coverType && minPrice && maxPrice){
                products = await ProductModel.find({ price: { $gt :  minPrice, $lt : maxPrice} });
            } else if(publisher && !coverType){
                products = await ProductModel.find({ publisher: publisher, price: { $gte :  minPrice, $lte : maxPrice} });
            } else if(publisher && coverType){
                products = await ProductModel.find({ publisher: publisher, coverType: coverType, price: { $gte :  minPrice, $lte : maxPrice} });
            }
            else if(!publisher && !coverType && !minPrice && !maxPrice && !searchQuery){
                products = await ProductModel.find();
            }
            

            return products;
        } catch(e) {
            console.log(e);
            return {errorMessage: 'Connot get filter products'};
        }
    }

    async deleteProductItems(req, res){
        try {
            // const { _id, num_items } = req.body;
            // let product = await ProductModel.findOne({_id: _id});
            // product.items.splice(0,num_items);

            // const result = ProductModel.save(function (err) {
            //     if (err) return handleError(err);
            // });
            // return res.json(result);

            let products  = req;
            let allProduct = await ProductModel.find();
            let items;


            for (let i=0; i< products.length; i++){
                if (allProduct.find(product => product._id.equals( products[i].id_product))){
                    items = (allProduct.find(product => product._id.equals( products[i].id_product))).items;
                   items.length -= products[i].count;
                   await ProductModel.updateOne({ _id: products[i].id_product }, { $set: { items: items } });
                }
            }
            return ;
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot delete product items' });
        }
    }

    async createProduct(req, res){
        try {
            const { title, price, coverType, publisher, description, num_items, pictures } = req.body;

            if(typeof pictures === 'object' && pictures)
                for(let i=0; i<pictures.length; i++){
                    if(!pictures[i]) pictures.splice(i,1);
                }

            let item = [];
            for (let i=0; i<num_items; i++){
                item.push(new mongoose.Types.ObjectId());
            }
            const result = ProductModel.create({ title: title, pictures: pictures, price: price, coverType: coverType, publisher:publisher, description:description, items: item});
            return res.redirect('/adminProducts');
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot create product' });
        }
    }

    async updateProduct(req, res){
        try {
            let { _id, title, pictures, price, coverType, publisher, description, num_items } = req.body;
            let resPics = []
            if(typeof pictures === 'object' && pictures)
                for(let i=0; i<pictures.length; i++){
                    if(pictures[i] && pictures[i]!=='') resPics.push(pictures[i]);
                }

                pictures = resPics;

            let items = (await ProductModel.findOne({_id: _id})).items;
            for (let i=0; i<num_items+1 - items.length; i++){
                items.push(new mongoose.Types.ObjectId());
            }

            if(num_items < items.length){
                items.splice(0, items.length - num_items);
            }
            const result = await ProductModel.updateOne({ _id: _id }, { $set: { title: title, pictures:pictures, price: price, coverType: coverType, publisher: publisher,description:description, items: items } });
            return res.redirect('/adminProducts');
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot update product' });
        }
    }
}

module.exports = new OrderController()