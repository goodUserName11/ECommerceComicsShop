const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const favouriteRouter = require('./favouriteRouter');
const orderRouter = require('./orderRouter');

router.use('/user', userRouter);
// router.use('/product', productRouter);
// router.use('/favourite', favouriteRouter);
// router.use('/order', orderRouter);

module.exports = router;