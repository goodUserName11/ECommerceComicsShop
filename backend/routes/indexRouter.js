const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const favouriteRouter = require('./favouriteRouter');
const orderRouter = require('./orderRouter');
const basketRouter = require('./basketRouter');

router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/favourite', favouriteRouter);
router.use('/order', orderRouter);
router.use('/basket', basketRouter);

module.exports = router;