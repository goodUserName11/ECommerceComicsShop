const mongoose = require('mongoose');
const express = require('express');

const router = require('./backend/routes/indexRouter');

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

app.use(express.json());

app.use('/api', router);

//Маршрутизация
app.get('/', function(req, res) {
    const comics = [
        { title: 'Sonic', price: 1000, image: "http://pm1.narvii.com/7830/ff21aeb5f66cb9db13c77a648ab503b63c13df30r1-659-1000v2_uhq.jpg" },
        { title: 'Super Sonic', price: 10000, image: 'https://cdn.eksmo.ru/v2/ITD000000001126861/COVER/cover1__w820.jpg' },
        { title: 'Hyper Sonic', price: 99000, image: 'https://eksmo.ru/upload/iblock/a89/720_min.jpg' },
        { title: 'Exlusive Sonic', price: 999999, image: 'https://overwiki.ru/images/thumb/8/8d/%D0%9C%D1%8F%D1%82%D0%B5%D0%B6_%28%D0%BA%D0%BE%D0%BC%D0%B8%D0%BA%D1%81%29.jpg/841px-%D0%9C%D1%8F%D1%82%D0%B5%D0%B6_%28%D0%BA%D0%BE%D0%BC%D0%B8%D0%BA%D1%81%29.jpg' }
    ];

    res.render('pages/index', {
        comics: comics
    });
});

app.get('/cart', function(req, res) {
    const comics = [
        { title: 'Sonic', price: 1000, image: "http://pm1.narvii.com/7830/ff21aeb5f66cb9db13c77a648ab503b63c13df30r1-659-1000v2_uhq.jpg"},
        { title: 'Hyper Sonic', price: 99000, image: 'https://eksmo.ru/upload/iblock/a89/720_min.jpg' },
        { title: 'Exlusive Sonic', price: 999999, image: 'https://overwiki.ru/images/thumb/8/8d/%D0%9C%D1%8F%D1%82%D0%B5%D0%B6_%28%D0%BA%D0%BE%D0%BC%D0%B8%D0%BA%D1%81%29.jpg/841px-%D0%9C%D1%8F%D1%82%D0%B5%D0%B6_%28%D0%BA%D0%BE%D0%BC%D0%B8%D0%BA%D1%81%29.jpg' }
    ];

    res.render('pages/cart', {
        comics: comics
    });
});

app.get('/catalog', function(req, res) {
    const comics = [
        { title: 'Sonic', price: 1000, image: "http://pm1.narvii.com/7830/ff21aeb5f66cb9db13c77a648ab503b63c13df30r1-659-1000v2_uhq.jpg" },
        { title: 'Super Sonic', price: 10000, image: 'https://cdn.eksmo.ru/v2/ITD000000001126861/COVER/cover1__w820.jpg' },
        { title: 'Hyper Sonic', price: 99000, image: 'https://eksmo.ru/upload/iblock/a89/720_min.jpg' },
        { title: 'Exlusive Sonic', price: 999999, image: 'https://overwiki.ru/images/thumb/8/8d/%D0%9C%D1%8F%D1%82%D0%B5%D0%B6_%28%D0%BA%D0%BE%D0%BC%D0%B8%D0%BA%D1%81%29.jpg/841px-%D0%9C%D1%8F%D1%82%D0%B5%D0%B6_%28%D0%BA%D0%BE%D0%BC%D0%B8%D0%BA%D1%81%29.jpg' }
    ];

    res.render('pages/catalog', {
        comics: comics
    });
});

app.get('/favourites', function(req, res) {
    const comics = [
        { title: 'Sonic', price: 1000, image: "http://pm1.narvii.com/7830/ff21aeb5f66cb9db13c77a648ab503b63c13df30r1-659-1000v2_uhq.jpg" },
        { title: 'Super Sonic', price: 10000, image: 'https://cdn.eksmo.ru/v2/ITD000000001126861/COVER/cover1__w820.jpg' },
        { title: 'Hyper Sonic', price: 99000, image: 'https://eksmo.ru/upload/iblock/a89/720_min.jpg' },
        { title: 'Exlusive Sonic', price: 999999, image: 'https://overwiki.ru/images/thumb/8/8d/%D0%9C%D1%8F%D1%82%D0%B5%D0%B6_%28%D0%BA%D0%BE%D0%BC%D0%B8%D0%BA%D1%81%29.jpg/841px-%D0%9C%D1%8F%D1%82%D0%B5%D0%B6_%28%D0%BA%D0%BE%D0%BC%D0%B8%D0%BA%D1%81%29.jpg' },
    ];

    res.render('pages/favourites', {
        comics: comics
    });
});

app.get('/product', function(req, res) {
    res.render('pages/product');
});

app.get('/login', function(req, res) {
    res.render('pages/login');
});

app.get('/registration', function(req, res) {
    res.render('pages/registration');
});

app.get('/user', function(req, res) {
    const orders = [
        { number: 1,
            products: [
                {title:'title', img: 'http://pm1.narvii.com/7830/ff21aeb5f66cb9db13c77a648ab503b63c13df30r1-659-1000v2_uhq.jpg', price: 100, count: 2, delivery_status: 'ok', delivery_date: 'today'},
                {title:'title', img: 'https://eksmo.ru/upload/iblock/a89/720_min.jpg', price: 100, count: 2, delivery_status: 'ok', delivery_date: 'today'}
            ],
            deliv_cost: 200 
        },
        { number: 2,
            products: [{title:'title', img: '#', price: 100, count: 2, delivery_status: 'ok', delivery_date: 'today'}],
            deliv_cost: 200 
        }
    ];


    res.render('pages/userPage', {
        orders: orders
    });
});

//Маршруты админа
app.get('/adminProducts', function(req, res) {
    res.render('pages/adminProducts');
});

app.get('/adminAddProduct', function(req, res) {
    res.render('pages/adminAddProduct');
});

app.get('/adminEditProduct', function(req, res) {
    res.render('pages/adminEditProduct');
});

app.get('/adminUsers', function(req, res) {
    res.render('pages/adminUsers');
});

app.get('/adminBuys', function(req, res) {
    res.render('pages/adminBuys');
});
//

start();

app.listen(port);