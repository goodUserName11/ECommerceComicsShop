//Доразобаться с лайками
const mongoose = require('mongoose');
const express = require('express');
const cookieSession = require('cookie-session')
const { uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const asyncHandler  = require('express-async-handler');
const router = require('./backend/routes/indexRouter');

const ProductController = require('./backend/controllers/productController');
const UserController = require('./backend/controllers/userController');
const OrderController = require('./backend/controllers/orderController');
const FavouriteController = require('./backend/controllers/favouriteController');
const BasketController = require('./backend/controllers/basketController');

const port = 8080;

const uri = "mongodb+srv://Admin:admin@cluster0.qsw7c.mongodb.net/comicsStore";

const app = express();
async function start(){
    try{
        await mongoose.connect(uri, {
            useNewUrlParser: true
        });
    }catch (error) {
        console.log(error);
    }
}

//Без этого отказывается принимать css-ки
//Refused to apply style from 'http://localhost:8080/css/...' because its MIME type
app.use(express.static(__dirname + '/public'));

//Подключение ejs
app.set('view engine', 'ejs');
//Указане где искать страницы
app.set('views', './public/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieSession({
    name: 'session',
    keys: ['user_token']
}));

app.use('/', router);

//Маршруты страниц

app.get('/error',  asyncHandler(async (req, res) => {
    res.render('pages/errorPage', {
        errorMessage: req.query.errorMessage
    })
}));

app.get('/',  asyncHandler(async (req, res) => {
    // const comics = [
    //     { title: 'Sonic', price: 1000, image: "http://pm1.narvii.com/7830/ff21aeb5f66cb9db13c77a648ab503b63c13df30r1-659-1000v2_uhq.jpg" },
    //     { title: 'Super Sonic', price: 10000, image: 'https://cdn.eksmo.ru/v2/ITD000000001126861/COVER/cover1__w820.jpg' },
    //     { title: 'Hyper Sonic', price: 99000, image: 'https://eksmo.ru/upload/iblock/a89/720_min.jpg' },
    //     { title: 'Exlusive Sonic', price: 999999, image: 'https://overwiki.ru/images/thumb/8/8d/%D0%9C%D1%8F%D1%82%D0%B5%D0%B6_%28%D0%BA%D0%BE%D0%BC%D0%B8%D0%BA%D1%81%29.jpg/841px-%D0%9C%D1%8F%D1%82%D0%B5%D0%B6_%28%D0%BA%D0%BE%D0%BC%D0%B8%D0%BA%D1%81%29.jpg' }
    // ];

    let admin, user, userName;

    let products = await ProductController.getAllProducts();
    if (products.errorMessage) {
        res.status(500);
    }

    if (req.session && req.session.user_token) {
        const userFavourites = await FavouriteController.getUserFavourites(req);

        for(let i = 0; i < products.length; i++) {
            userFavourites.forEach(function(favourtite){
                if(products[i]._id.equals(favourtite.productId._id)){
                    products[i] = {...products[i]._doc, isLiked: true};
                }
            });
        }

        user = true;
        let useruser = await UserController.getOneUser(req.session.user_token);

        if(!useruser.name) {
            res.redirect("/userPage");
            return;
        }

        admin = useruser.isAdmin;
        userName = useruser.name;
    }

    res.render('pages/index', {
        comics: products.reverse(),
        userName,
        user,
        admin
    });


}));

app.get('/cart',  asyncHandler(async (req, res) => {
    // const comics = [
    //     { title: 'Sonic', price: 1000, image: "http://pm1.narvii.com/7830/ff21aeb5f66cb9db13c77a648ab503b63c13df30r1-659-1000v2_uhq.jpg"},
    //     { title: 'Hyper Sonic', price: 99000, image: 'https://eksmo.ru/upload/iblock/a89/720_min.jpg' },
    //     { title: 'Exlusive Sonic', price: 999999, image: 'https://overwiki.ru/images/thumb/8/8d/%D0%9C%D1%8F%D1%82%D0%B5%D0%B6_%28%D0%BA%D0%BE%D0%BC%D0%B8%D0%BA%D1%81%29.jpg/841px-%D0%9C%D1%8F%D1%82%D0%B5%D0%B6_%28%D0%BA%D0%BE%D0%BC%D0%B8%D0%BA%D1%81%29.jpg' }
    // ];

    let admin, user;

    if (!req.session || !req.session.user_token) { 
        res.redirect('/login');
        return; 
    }

    user = true;
    
    let useruser = await UserController.getOneUser(req.session.user_token);

    if (!useruser.name) {
        res.redirect("/userPage");
        return;
    }

    admin = useruser.isAdmin;

    let basketProducts = (await BasketController.getUserBasket(req.session.user_token)).products;

    res.render('pages/cart', {
        comics: basketProducts,
        admin,
        user
    });
}));

app.get('/catalog', asyncHandler(async (req, res) => {

    let admin, user;

    let products = await ProductController.getFilterProducts(req);

    if (products.errorMessage) {
        res.status(500);
    }

    if (req.session && req.session.user_token) {
        const userFavourites = await FavouriteController.getUserFavourites(req);

        for(let i = 0; i < products.length; i++) {
            userFavourites.forEach(function(favourtite){
                if(products[i]._id.equals(favourtite.productId._id)){
                    products[i] = {...products[i]._doc, isLiked: true};
                }
            });
        }

        user = true;

        let useruser = await UserController.getOneUser(req.session.user_token);

        if (!useruser.name) {
            res.redirect("/userPage");
            return;
        }

        admin = useruser.isAdmin;
    }


    res.render('pages/catalog', {
        comics: products,
        publisher: req.query.publisher,
        prevSearchQuery: req.query.searchQuery,
        user,
        admin
    });
}));

app.get('/favourites', asyncHandler(async (req, res) => {

    let admin, user;

    if (!req.session || !req.session.user_token) { 
        res.redirect('/login');
        return; 
    }

    const userFavourites = await FavouriteController.getUserFavourites(req);

    let userFavouriteProducts = [];

    userFavourites.forEach(function(favourtite){
        userFavouriteProducts.push({...favourtite.productId._doc, isLiked: true});
    });

    user = true;

    let useruser = await UserController.getOneUser(req.session.user_token);

    if (!useruser.name) {
        res.redirect("/userPage");
        return;
    }

    admin = useruser.isAdmin;

    res.render('pages/favourites', {
        userFavouriteProducts: userFavouriteProducts,
        admin,
        user
    });
}));

app.get('/product', asyncHandler(async (req, res) => {

    let admin, user;

    let product = await ProductController.getOneProduct(req);
    if (product.errorMessage) {
        res.status(500);
    }


    let similar = await ProductController.getSomeProducts(req);
    if (req.session && req.session.user_token) {
        let userFavourites = await FavouriteController.getUserFavourites(req);

        userFavourites.forEach(favourite => {
            if (product._id.equals(favourite.productId._id)) {
                product = { ...product._doc, isLiked: true };
            }
        });
        

        for(let i = 0; i < similar.length; i++) {
            userFavourites.forEach(function(favourtite){
                if(similar[i]._id.equals(favourtite.productId._id)){
                    similar[i] = {...similar[i]._doc, isLiked: true};
                }
            });
        }

        user = true;

        let useruser = await UserController.getOneUser(req.session.user_token);

        if (!useruser.name) {
            res.redirect("/userPage");
            return;
        }

        admin = useruser.isAdmin;

        admin = (await UserController.getOneUser(req.session.user_token)).isAdmin
    }

    res.render('pages/product', {
        product: product,
        similar: similar,
        admin,
        user
    });
    //res.render('pages/product');
}));

app.get('/login',  asyncHandler(async (req, res) => {
    let admin, user;

    if (req.session && req.session.user_token) {
        user = true;
        admin = (await UserController.getOneUser(req.session.user_token)).isAdmin
    }

    res.render('pages/login', {admin, user});
}));

app.get('/registration',  asyncHandler(async (req, res) => {
    let admin, user;

    if (req.session && req.session.user_token) {
        user = true;
        admin = (await UserController.getOneUser(req.session.user_token)).isAdmin
    }

    res.render('pages/registration', {admin, user});
}));

app.get('/userPage',  asyncHandler(async (req, res) => {
    let admin, user;

    if (!req.session || !req.session.user_token) { 
        res.redirect('/login');
        return; 
    }

    let useruser = await UserController.getOneUser(req.session.user_token);

    let ordersUsers = await OrderController.getUserOrders(req);

    user = true;
    admin = useruser.isAdmin;

    res.render('pages/userPage', {
        userInfo: useruser,
        orders: ordersUsers,
        user,
        admin
    });
}));

app.get('/thanks',  asyncHandler(async (req, res) => {
    let admin, user;

    if (req.session && req.session.user_token) {
        user = true;
        admin = (await UserController.getOneUser(req.session.user_token)).isAdmin
    }



    res.render('pages/thanks', {admin, user});
}));

//Маршруты страниц админа
app.get('/adminProducts',  asyncHandler(async (req, res) => {

    let admin, user;

    if (!req.session || !req.session.user_token) { 
        res.redirect('/login');
        return; 
    }

    user = true;
    admin = (await UserController.getOneUser(req.session.user_token)).isAdmin;

    if(!admin){
        res.redirect('/');
        return;
    }

    let ordersUsers = await OrderController.getAllOrders();
    let products = await ProductController.getAllProducts();

    let allProductsFromOrders = [];

    for (const order of ordersUsers) {
        for(const orderProducts of order.products)
                allProductsFromOrders.push({...orderProducts.productId._doc, count: orderProducts.count});
    }

    for(let i = 0; i < products.length; i++){
        products[i] = {
            ...products[i]._doc,
            count: products[i].items.length,
            ordersCount: 0
        };
    }

    for (let i = 0; i < allProductsFromOrders.length; i++){
        let index = products.findIndex(product => product._id.equals(allProductsFromOrders[i]._id));
        products[index].ordersCount += Number(allProductsFromOrders[i].count);
    }

    res.render('pages/adminProducts', {
        products,
        admin,
        user
    });
}));

app.get('/adminAddProduct',  asyncHandler(async (req, res) => {
    let admin, user;

    if (!req.session || !req.session.user_token) { 
        res.redirect('/login');
        return; 
    }

    user = true;
    admin = (await UserController.getOneUser(req.session.user_token)).isAdmin;

    if(!admin){
        res.redirect('/');
        return;
    }

    res.render('pages/adminAddProduct', {
        admin,
        user
    });
}));

app.get('/adminEditProduct',  asyncHandler(async (req, res) => {
    let admin, user;

    if (!req.session || !req.session.user_token) { 
        res.redirect('/login');
        return; 
    }

    user = true;
    admin = (await UserController.getOneUser(req.session.user_token)).isAdmin;

    if(!admin){
        res.redirect('/');
        return;
    }

    let product = await ProductController.getOneProduct(req);

    res.render('pages/adminEditProduct', {
        product,
        admin,
        user
    });
}));

app.get('/adminUsers',  asyncHandler(async (req, res) => {
    let admin, user;

    if (!req.session || !req.session.user_token) { 
        res.redirect('/login');
        return; 
    }

    user = true;
    admin = (await UserController.getOneUser(req.session.user_token)).isAdmin;

    if(!admin){
        res.redirect('/');
        return;
    }

    let ordersUsers = await OrderController.getAllOrders();
    let users = await UserController.getAllUsers();

    for(let i = 0; i < users.length; i++){
        users[i] = { ...users[i]._doc,
            ordersCount: ordersUsers.filter(order => order.userId._id.equals(users[i]._id)).length};
    }

    res.render('pages/adminUsers', {
        users,
        admin,
        user
    });
}));

app.get('/adminBuys',  asyncHandler(async (req, res) => {
    let admin, user;

    if (!req.session || !req.session.user_token) { 
        res.redirect('/login');
        return; 
    }

    user = true;
    admin = (await UserController.getOneUser(req.session.user_token)).isAdmin;

    if(!admin){
        res.redirect('/');
        return;
    }

    let ordersUsers = await OrderController.getAllOrders();

    res.render('pages/adminBuys', {
        orders: ordersUsers,
        admin,
        user
    });
}));
//

start();

app.listen(port);