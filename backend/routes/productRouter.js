const Router = require('express');
const router = new Router();

const productController = require('../controllers/productController');

// router.get('/', productController.getAllProducts);
router.get('/getOneProduct', productController.getOneProduct);
router.get('/getSomeProducts', productController.getSomeProducts);
router.get('/getSearchProducts', productController.getSearchProducts);
// router.get('/getFilterProducts', productController.getFilterProducts);
router.post('/create', productController.createProduct);
router.post('/deleteItems', productController.deleteProductItems);
router.post('/update', productController.updateProduct);

module.exports = router