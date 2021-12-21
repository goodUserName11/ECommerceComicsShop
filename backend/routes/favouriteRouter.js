const Router = require('express');
const router = new Router();

const favouriteController = require('../controllers/favouriteController');

router.get('/', favouriteController.getAllFavourites);
router.get('/getUserFavourites', favouriteController.getUserFavourites);
router.post('/create', favouriteController.createFavourite);
router.post('/createDeleteFavourite', favouriteController.createDeleteFavourite);
// router.post('/updateInfo', favouriteController.);


module.exports = router