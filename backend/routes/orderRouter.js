const Router = require('express');
const router = new Router();

const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.get('/userOrders', orderController.getUserOrders);
router.get('/filterOrders', orderController.filterOrders);
router.post('/create', orderController.createOrder);
// router.post('/delete', orderController.deleteOrder);
router.post('/update', orderController.updateOrder);


module.exports = router